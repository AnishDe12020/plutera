import { Button, Heading, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import ConnectWallet from "../src/components/ConnectWallet";

const AuthPage: NextPage = () => {
  const router = useRouter();

  return (
    <>
      <ConnectWallet
        callbackUrl={
          router.query.callbackUrl
            ? (router.query.callbackUrl as string)
            : undefined
        }
      >
        Authenticate
      </ConnectWallet>
    </>
  );
};

export default AuthPage;
