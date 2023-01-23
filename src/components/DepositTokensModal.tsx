import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  VStack,
  ButtonProps,
  useDisclosure,
  Icon,
  useToast,
  Text,
} from "@chakra-ui/react";
import { Buidl } from "@prisma/client";
import { BN } from "@project-serum/anchor";
import {
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import axios from "axios";
import { LandmarkIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import useProgram from "../hooks/useProgram";

import ConnectWallet from "./ConnectWallet";

interface DepositTokensForm {
  amount: number;
}

interface DepositTokensModalProps extends ButtonProps {
  buidl: Buidl;
  callbackUrl?: string;
}

const DepositTokensModal = ({
  children = "Fund Buidl",
  buidl,
  callbackUrl,
  ...otherProps
}: DepositTokensModalProps) => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { connection } = useConnection();
  const { sendTransaction, publicKey } = useWallet();

  const { program } = useProgram();

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<DepositTokensForm>();

  const toast = useToast();

  const handlePostUpdate = useCallback(
    async (data: DepositTokensForm) => {
      if (!program) {
        throw new Error("Program not initialized");
      }

      if (!session?.user?.name) {
        throw new Error("User not logged in");
      }

      console.log(data);

      const backerAccountPDA = PublicKey.findProgramAddressSync(
        [
          Buffer.from("backer"),
          new PublicKey(buidl.pubkey).toBuffer(),
          new PublicKey(session.user.name).toBuffer(),
        ],
        program.programId
      )[0];

      const depositorTokenAccountAddress = getAssociatedTokenAddressSync(
        new PublicKey(buidl.token.address),
        new PublicKey(session.user.name)
      );

      try {
        await getAccount(connection, depositorTokenAccountAddress);
      } catch (error) {
        if (
          error instanceof TokenAccountNotFoundError ||
          error instanceof TokenInvalidAccountOwnerError
        ) {
          const tx = new Transaction();

          const ix = createAssociatedTokenAccountInstruction(
            new PublicKey(session.user.name),
            depositorTokenAccountAddress,
            new PublicKey(session.user.name),
            new PublicKey(buidl.token.address)
          );

          tx.add(ix);

          try {
            const latestBlockhash = await connection.getLatestBlockhash();

            const sig = await sendTransaction(tx, connection);

            await connection.confirmTransaction(
              {
                signature: sig,
                blockhash: latestBlockhash.blockhash,
                lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
              },
              "processed"
            );

            toast({
              title: "Token account created",
              description: "Your token account has been created",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          } catch (error) {
            console.error(error);
            toast({
              title: "Error creating token account",
              // @ts-ignore
              description: error.message,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        }
      }

      const [vaultPDAAddress] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("vault"),
          new PublicKey(buidl.pubkey).toBuffer(),
          new PublicKey(buidl.token.address).toBuffer(),
        ],
        program.programId
      );

      console.log("dep", depositorTokenAccountAddress.toBase58());
      console.log("vault", vaultPDAAddress.toBase58());

      const sig = await program.methods
        .deposit(new BN(data.amount))
        .accounts({
          buidlAccount: new PublicKey(buidl.pubkey),
          backerAccount: backerAccountPDA,
          depositor: new PublicKey(session.user.name),
          depositorTokenAccount: depositorTokenAccountAddress,
          mint: new PublicKey(buidl.token.address),
          vault: vaultPDAAddress,
        })
        .rpc();

      await connection.confirmTransaction(sig);

      await axios.patch("/api/buidls/update", {
        amountRaised: Number(buidl.amountRaised) + Number(data.amount),
        id: buidl.id,
      });

      await axios.post("/api/backers", {
        buidlId: buidl.id,
        userPubkey: session.user.name,
        pubkey: backerAccountPDA,
        amount: data.amount,
      });

      await axios.post("/api/mint", {
        pubkey: session.user.name,
        buidlId: buidl.id,
      });

      toast({
        title: "Tokens deposited",
        description: "Your tokens have been deposited",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    [program, session?.user?.name, buidl, connection, sendTransaction, toast]
  );

  const { mutate, isLoading } = useMutation(handlePostUpdate);

  return (
    <>
      <Button
        color="white"
        leftIcon={<Icon as={LandmarkIcon} />}
        onClick={onOpen}
        {...otherProps}
      >
        {children}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Fund Buidl</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack
              gap={4}
              as="form"
              onSubmit={handleSubmit((data) => mutate(data))}
            >
              <VStack gap={1}>
                <Text>
                  Remaining amount required by the buidl:{" "}
                  {buidl.amountRequested - buidl.amountRaised}
                </Text>
                <Text fontSize="xs" color="gray.300">
                  Amount buidl had requested in total: {buidl.amountRequested}
                </Text>
                <Text fontSize="xs" color="gray.300">
                  Amount buidl has got in funding till now: {buidl.amountRaised}
                </Text>
              </VStack>

              <FormControl isRequired isInvalid={errors.amount ? true : false}>
                <FormLabel>Amount</FormLabel>
                <Input
                  {...register("amount", {
                    required: {
                      value: true,
                      message: "Required",
                    },
                  })}
                  type="number"
                />
                <FormHelperText>
                  Amount of money you want to fund
                </FormHelperText>
                {errors.amount && (
                  <FormErrorMessage>{errors.amount.message}</FormErrorMessage>
                )}
              </FormControl>

              {session?.user?.name && publicKey ? (
                <Button color="white" isLoading={isLoading} type="submit">
                  Fund
                </Button>
              ) : (
                <ConnectWallet callbackUrl={callbackUrl}>
                  Connect Wallet
                </ConnectWallet>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DepositTokensModal;
