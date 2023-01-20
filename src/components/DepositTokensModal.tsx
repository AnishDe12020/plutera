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
  Textarea,
  VStack,
  ButtonProps,
  useDisclosure,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { BN } from "@project-serum/anchor";
import {
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { LandmarkIcon, PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import useProgram from "../hooks/useProgram";
import { BONK_TOKEN, USDC_TOKEN } from "../lib/constants";
import { Token } from "../types/model";

interface DepositTokensForm {
  amount: number;
}

interface DepositTokensModalProps extends ButtonProps {
  buidl: any; // TODO: type this
}

const DepositTokensModal = ({
  children = "Post Update",
  buidl,
  ...otherProps
}: DepositTokensModalProps) => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { connection } = useConnection();
  const { sendTransaction } = useWallet();

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

      const token = buidl.token === Token.USDC ? USDC_TOKEN : BONK_TOKEN;

      console.log(data);

      const backerAccountPDA = PublicKey.findProgramAddressSync(
        [
          Buffer.from("backer"),
          new PublicKey(buidl.address).toBuffer(),
          new PublicKey(session.user.name).toBuffer(),
        ],
        program.programId
      )[0];

      const depositorTokenAccountAddress = getAssociatedTokenAddressSync(
        new PublicKey(token.address),
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
            new PublicKey(token.address)
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
          new PublicKey(buidl.address).toBuffer(),
          new PublicKey(token.address).toBuffer(),
        ],
        program.programId
      );

      //   program.methods
      //     .deposit(new BN(data.amount))
      //     .accounts({
      //       buidlAccount: new PublicKey(buidl.address),
      //       backerAccount: backerAccountPDA,
      //       depositor: new PublicKey(session.user.name),
      //       depositorTokenAccount: depositorTokenAccountAddress,
      //       mint: new PublicKey(token.address),
      //       vault: vaultPDAAddress,
      //     })
      //     .rpc();
    },
    [program, session?.user?.name, buidl, connection, sendTransaction, toast]
  );

  const { mutate, isLoading } = useMutation(handlePostUpdate);

  return (
    <>
      <Button
        leftIcon={<Icon as={LandmarkIcon} />}
        onClick={onOpen}
        {...otherProps}
      >
        {children}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Update</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack
              gap={4}
              as="form"
              onSubmit={handleSubmit((data) => mutate(data))}
            >
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
                {errors.amount && (
                  <FormErrorMessage>{errors.amount.message}</FormErrorMessage>
                )}
              </FormControl>

              <Button isLoading={isLoading} type="submit">
                Deposit
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DepositTokensModal;
