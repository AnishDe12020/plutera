import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import { Keypair } from "@solana/web3.js";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import useProgram from "../../src/hooks/useProgram";
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
    watch,
    handleSubmit,
  } = useForm<NewBuidlForm>({
    defaultValues: {
      token: Token.USDC,
    },
  });

  const handleCreateBuidl = useCallback(
    async (data: NewBuidlForm) => {
      if (!program) {
        throw new Error("Program not initialized");
      }

      // TODO: create buidl on db and store the id in db_id

      let db_id = "test";

      const buidlAccountKeypair = Keypair.generate();

      program.methods
        .initializeBuidl(db_id)
        .accounts({
          buidlAccount: buidlAccountKeypair.publicKey,
          mint: Token.USDC,
        })
        .signers([])
        .rpc();
    },
    [program]
  );

  const { mutate, isLoading } = useMutation(handleCreateBuidl);

  return (
    <>
      <Heading>Your Buidls</Heading>

      {/* TODO: fetch builds on server side and display here */}

      <VStack gap={4} as="form" onSubmit={handleSubmit((data) => mutate(data))}>
        {/* <VStack gap={2}>
          <Avatar src={logoUrl} />

          <FileUpload name="logo" control={control} acceptedFileTypes="image/*" filename={uuid}>
            Upload Logo
          </FileUpload>
        </VStack> */}

        <FormControl isRequired>
          <FormLabel>Organization Name</FormLabel>
          <Input {...register("name", { required: true })} />
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
