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
} from "@chakra-ui/react";
import { Keypair, PublicKey } from "@solana/web3.js";
import { PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
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
  logoUrl?: string;
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

      // TODO: create buidl on db and store the id in db_id

      // let db_id = "test";

      const buidlAccountKeypair = Keypair.generate();

      const [vaultPDAAddress] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("vault"),
          buidlAccountKeypair.publicKey.toBuffer(),
          new PublicKey(token.address).toBuffer(),
        ],
        program.programId
      );

      // program.methods
      //   .initializeBuidl(db_id)
      //   .accounts({
      //     buidlAccount: buidlAccountKeypair.publicKey,
      // mint: token.address,
      //     owner: session.user.name,
      //     vault: vaultPDAAddress,
      //   })
      //   .signers([buidlAccountKeypair])
      //   .rpc();
    },
    [program, session?.user?.name]
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

              <Button isLoading={isLoading} type="submit">
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
