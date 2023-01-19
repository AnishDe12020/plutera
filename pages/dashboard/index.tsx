import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  Radio,
  RadioGroup,
  Text,
  Textarea,
  useRadioGroup,
  VStack,
} from "@chakra-ui/react";
import { Keypair, PublicKey } from "@solana/web3.js";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { useController, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import TokenRadio from "../../src/components/TokenRadio";
import useProgram from "../../src/hooks/useProgram";
import { BONK_TOKEN, USDC_TOKEN } from "../../src/lib/constants";
import { Token } from "../../src/types/model";
import { authOptions } from "../api/auth/[...nextauth]";

interface NewBuidlForm {
  name: string;
  description?: string;
  logoUrl: string;
  token: Token;
}

const DashboardPage = () => {
  const { data: session } = useSession();
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
      //     mint: Token.USDC,
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
      <Heading>Your Buidls</Heading>

      {/* TODO: fetch builds on server side and display here */}

      <VStack gap={4} as="form" onSubmit={handleSubmit((data) => mutate(data))}>
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input {...register("name", { required: true })} />
          {errors.name && <FormErrorMessage>Required</FormErrorMessage>}
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea {...register("description", { required: false })} />
          {errors.name && <FormErrorMessage>Required</FormErrorMessage>}
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Token</FormLabel>
          <RadioGroup>
            <HStack>
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
          </RadioGroup>
          <FormHelperText>Token you want to receive funding in</FormHelperText>
          {errors.name && <FormErrorMessage>Required</FormErrorMessage>}
        </FormControl>

        <Button isLoading={isLoading} type="submit">
          Create Organization
        </Button>
      </VStack>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions(context.req)
  );

  if (!session?.user?.name) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default DashboardPage;
