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
} from "@chakra-ui/react";
import { BN } from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import useProgram from "../hooks/useProgram";
import { BONK_TOKEN, USDC_TOKEN } from "../lib/constants";
import { Token } from "../types/model";

interface NewProposalForm {
  name: string;
  purpose: string;
  amount: number;
  withdrawerAddresss: string;
  numberOfDays: number;
}

interface CreateProposalModalProps extends ButtonProps {
  buidl: any; // TODO: type this
}

const CreateProposalModal = ({
  children = "New Proposal",
  buidl,
  ...otherProps
}: CreateProposalModalProps) => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { program } = useProgram();

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<NewProposalForm>();

  const handleCreateBuidl = useCallback(
    async (data: NewProposalForm) => {
      if (!program) {
        throw new Error("Program not initialized");
      }

      if (!session?.user?.name) {
        throw new Error("User not logged in");
      }

      console.log(data);

      // TODO: create buidl on db and store the id in db_id

      let db_id = "test";

      const token = buidl.token === Token.USDC ? USDC_TOKEN : BONK_TOKEN;

      const proposalAccountKeypair = Keypair.generate();

      const [vaultPDAAddress] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("vault"),
          new PublicKey(buidl.address).toBuffer(),
          new PublicKey(token.address).toBuffer(),
        ],
        program.programId
      );

      // program.methods
      //   .createProposal(
      //     new BN(data.amount),
      //     db_id,
      //     new PublicKey(data.withdrawerAddresss),
      //     new BN(7)
      //   )
      //   .accounts({
      //     buidlAccount: new PublicKey(buidl.address),
      //     proposalAccount: proposalAccountKeypair.publicKey,
      //     payer: new PublicKey(session.user.name),
      //     vault: vaultPDAAddress,
      //   })
      //   .signers([proposalAccountKeypair])
      //   .rpc();
    },
    [program, session?.user?.name, buidl]
  );

  const { mutate, isLoading } = useMutation(handleCreateBuidl);

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
          <ModalHeader>New Buidl</ModalHeader>
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
                <FormLabel>Description</FormLabel>
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
