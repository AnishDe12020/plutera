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
  HStack,
  Input,
  Textarea,
  useRadioGroup,
  VStack,
  ButtonProps,
  useDisclosure,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey } from "@solana/web3.js";
import axios from "axios";
import { ObjectId } from "bson";
import { PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useController, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import useProgram from "../hooks/useProgram";
import { BONK_TOKEN, USDC_TOKEN } from "../lib/constants";
import { Token } from "../types/model";
import TokenRadio from "./TokenRadio";

interface NewBuidlForm {
  name: string;
  description?: string;
  amount: number;
  token: Token;
}

const CreateBuidlModal = ({
  children = "New Buidl",
  ...otherProps
}: ButtonProps) => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { program } = useProgram();
  const { connection } = useConnection();

  const router = useRouter();

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<NewBuidlForm>({
    defaultValues: {
      token: Token.USDC,
    },
  });

  const {
    field: { value: selectedToken, onChange: onSelectedTokenChange },
  } = useController({
    control,
    name: "token",
    defaultValue: Token.USDC,
  });

  const {
    getRadioProps: getSelectedTokensRadioProps,
    getRootProps: getSelectedTokenRootProps,
  } = useRadioGroup({
    onChange: onSelectedTokenChange,
    value: selectedToken,
  });

  const toast = useToast();

  const handleCreateBuidl = useCallback(
    async (data: NewBuidlForm) => {
      if (!program) {
        throw new Error("Program not initialized");
      }

      if (!session?.user?.name) {
        throw new Error("User not logged in");
      }

      console.log(data);

      const token = data.token === Token.USDC ? USDC_TOKEN : BONK_TOKEN;

      const db_id = new ObjectId().toString();

      const buidlAccountKeypair = Keypair.generate();

      const [vaultPDAAddress] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("vault"),
          buidlAccountKeypair.publicKey.toBuffer(),
          new PublicKey(token.address).toBuffer(),
        ],
        program.programId
      );

      const sig = await program.methods
        .initializeBuidl(db_id)
        .accounts({
          buidlAccount: buidlAccountKeypair.publicKey,
          mint: token.address,
          owner: session.user.name,
          vault: vaultPDAAddress,
        })
        .signers([buidlAccountKeypair])
        .rpc();

      await connection.confirmTransaction(sig);

      const {
        data: { buidl },
      } = await axios.post("/api/buidls/create", {
        id: db_id,
        name: data.name,
        description: data.description,
        amountRequested: data.amount,
        token: {
          address: token.address,
          symbol: token.symbol,
          logoURI: token.logoURI,
        },
        pubkey: buidlAccountKeypair.publicKey.toBase58(),
        ownerPubkey: session.user.name,
      });

      console.log("created buidl", buidl);

      router.reload();

      toast({
        title: "Buidl created",
        description: "Your buidl has been created",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    [program, session?.user?.name, connection, toast, router]
  );

  const { mutate, isLoading } = useMutation(handleCreateBuidl);

  return (
    <>
      <Button
        color="white"
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

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea {...register("description", { required: false })} />
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
                  Amount of funding you need in the token chosen below
                </FormHelperText>
                {errors.amount && (
                  <FormErrorMessage>{errors.amount.message}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isRequired isInvalid={errors.token ? true : false}>
                <FormLabel>Token</FormLabel>
                <HStack {...getSelectedTokenRootProps()}>
                  <TokenRadio
                    logoURI={USDC_TOKEN.logoURI}
                    symbol="USDC"
                    {...getSelectedTokensRadioProps({ value: Token.USDC })}
                  />
                  <TokenRadio
                    logoURI={BONK_TOKEN.logoURI}
                    symbol="BONK"
                    {...getSelectedTokensRadioProps({ value: Token.BONK })}
                  />
                </HStack>
                <FormHelperText>
                  Token you want to receive funding in (YOU CANNOT CHANGE THIS
                  LATER)
                </FormHelperText>
                {errors.token && (
                  <FormErrorMessage>{errors.token.message}</FormErrorMessage>
                )}
              </FormControl>

              <Button color="white" isLoading={isLoading} type="submit">
                Create Buidl
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateBuidlModal;
