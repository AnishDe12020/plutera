import { Text, Heading, VStack, HStack, Image } from "@chakra-ui/react";
import { Buidl } from "@prisma/client";
import { useWallet } from "@solana/wallet-adapter-react";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import ConnectWallet from "../../src/components/ConnectWallet";
import DepositTokensModal from "../../src/components/DepositTokensModal";
import { prisma } from "../../src/lib/db";

interface BuidlPageProps {
  buidl: Buidl;
}

const BuidlPage = ({ buidl }: BuidlPageProps) => {
  const { data: session } = useSession();
  const { publicKey } = useWallet();

  return (
    <VStack gap={16}>
      <VStack gap={2}>
        <Heading>{buidl.name}</Heading>
        <Text fontSize="lg">{buidl.description}</Text>
      </VStack>

      <VStack gap={4}>
        <VStack>
          <HStack>
            <Image
              src={buidl.token.logoURI}
              alt={buidl.token.symbol}
              h={10}
              w={10}
            />
            <Text fontSize="3xl">
              {buidl.token.symbol} {buidl.amountRaised} raised till now
            </Text>
          </HStack>
          <HStack fontSize="lg">
            <Text>of the </Text>
            <Image
              src={buidl.token.logoURI}
              alt={buidl.token.symbol}
              h={10}
              w={10}
            />
            <Text>
              {buidl.token.symbol} {buidl.amountRequested} requested
            </Text>
          </HStack>
        </VStack>

        {session?.user?.name && publicKey ? (
          <DepositTokensModal buidl={buidl}>
            Fund {buidl.name}
          </DepositTokensModal>
        ) : (
          <ConnectWallet callbackUrl={`/buidls/${buidl.id}`}>
            Connect Wallet to Fund
          </ConnectWallet>
        )}
      </VStack>
    </VStack>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query.id;

  const buidl = await prisma.buidl.findUnique({
    where: {
      id: id as string,
    },
  });

  if (!buidl) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      buidl: JSON.parse(JSON.stringify(buidl)),
    },
  };
};

export default BuidlPage;
