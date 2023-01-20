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
import CreateBuidlModal from "../../src/components/CreateBuidlModal";
import TokenRadio from "../../src/components/TokenRadio";
import useProgram from "../../src/hooks/useProgram";
import { BONK_TOKEN, USDC_TOKEN } from "../../src/lib/constants";
import { Token } from "../../src/types/model";
import { authOptions } from "../api/auth/[...nextauth]";

const DashboardPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Heading>Your Buidls</Heading>

      {/* TODO: fetch builds on server side and display here */}

      <CreateBuidlModal>New Buidl</CreateBuidlModal>
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
