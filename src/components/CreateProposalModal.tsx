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
import { Buidl } from "@prisma/client";
import { BN } from "@project-serum/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey } from "@solana/web3.js";
import axios from "axios";
import { ObjectId } from "bson";
import { PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import useProgram from "../hooks/useProgram";

interface NewProposalForm {
  name: string;
  purpose: string;
  amount: number;
  withdrawerAddresss: string;
  numberOfDays: number;
}

interface CreateProposalModalProps extends ButtonProps {
  buidl: Buidl;
}

const CreateProposalModal = ({
  children = "New Proposal",
  buidl,
  ...otherProps
}: CreateProposalModalProps) => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { connection } = useConnection();

  const { program } = useProgram();

  const toast = useToast();

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<NewProposalForm>();

  const handleCreateProposal = useCallback(
    async (data: NewProposalForm) => {
      if (!program) {
        throw new Error("Program not initialized");
      }

      if (!session?.user?.name) {
        throw new Error("User not logged in");
      }

      console.log(data);

      const db_id = new ObjectId().toString();

      const proposalAccountKeypair = Keypair.generate();

      const [vaultPDAAddress] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("vault"),
          new PublicKey(buidl.pubkey).toBuffer(),
          new PublicKey(buidl.token.address).toBuffer(),
        ],
        program.programId
      );

      const sig = await program.methods
        .createProposal(
          new BN(data.amount),
          db_id,
          new PublicKey(data.withdrawerAddresss),
          new BN(data.numberOfDays)
        )
        .accounts({
          buidlAccount: new PublicKey(buidl.pubkey),
          proposalAccount: proposalAccountKeypair.publicKey,
          payer: new PublicKey(session.user.name),
          vault: vaultPDAAddress,
        })
        .signers([proposalAccountKeypair])
        .rpc();

      await connection.confirmTransaction(sig);

      const {
        data: { proposal },
      } = await axios.post("/api/proposals", {
        id: db_id,
        buidlId: buidl.id,
        name: data.name,
        purpose: data.purpose,
        amount: Number(data.amount),
        endTimestamp: new Date().getTime() + data.numberOfDays * 24 * 60 * 60,
        withdrawerAddress: data.withdrawerAddresss,
        pubkey: proposalAccountKeypair.publicKey.toBase58(),
      });

      console.log("created proposal", proposal);

      toast({
        title: "Proposal created",
        description: "Your proposal has been created",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    [program, session?.user?.name, buidl, connection, toast]
  );

  const { mutate, isLoading } = useMutation(handleCreateProposal);

  return (
    <>
      <Button
        leftIcon={<Icon as={PlusIcon} />}
        onClick={onOpen}
        {...otherProps}
      >
        {children}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Proposal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack
              gap={4}
              as="form"
              onSubmit={handleSubmit((data) => mutate(data))}
            >
              <FormControl isRequired isInvalid={errors.name ? true : false}>
                <FormLabel>Name</FormLabel>
                <Input
                  {...register("name", {
                    required: {
                      value: true,
                      message: "Required",
                    },
                  })}
                />
                {errors.name && (
                  <FormErrorMessage>{errors.name.message}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isRequired isInvalid={errors.purpose ? true : false}>
                <FormLabel>Purpose</FormLabel>
                <Textarea
                  {...register("purpose", {
                    required: {
                      value: true,
                      message: "Required",
                    },
                  })}
                />
                <FormHelperText>
                  A proper reason for the need of the funds. Include links, etc.
                </FormHelperText>
                {errors.purpose && (
                  <FormErrorMessage>{errors.purpose.message}</FormErrorMessage>
                )}
              </FormControl>

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
                  Max: {buidl.token.symbol} {buidl.amountRaised} as that is the
                  amount of funding you have received
                </FormHelperText>
                {errors.amount && (
                  <FormErrorMessage>{errors.amount.message}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                isRequired
                isInvalid={errors.numberOfDays ? true : false}
              >
                <FormLabel>End after</FormLabel>
                <Input
                  {...register("numberOfDays", {
                    required: {
                      value: true,
                      message: "Required",
                    },
                    min: {
                      value: 3,
                      message: "Minimum 3 days",
                    },
                  })}
                  type="number"
                />
                <FormHelperText>
                  Number of days after which the proposal will end (minimum 3)
                </FormHelperText>
                {errors.numberOfDays && (
                  <FormErrorMessage>
                    {errors.numberOfDays.message}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                isRequired
                isInvalid={errors.withdrawerAddresss ? true : false}
              >
                <FormLabel>Withdrawer Address</FormLabel>
                <Input
                  {...register("withdrawerAddresss", {
                    required: {
                      value: true,
                      message: "Required",
                    },
                  })}
                />
                <FormHelperText>
                  Valid Solana wallet address to which funds should be sent to
                  if the proposal is passed
                </FormHelperText>
                {errors.withdrawerAddresss && (
                  <FormErrorMessage>
                    {errors.withdrawerAddresss.message}
                  </FormErrorMessage>
                )}
              </FormControl>

              <Button isLoading={isLoading} type="submit">
                Create Proposal
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateProposalModal;
