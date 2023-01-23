import {
  Text,
  Heading,
  VStack,
  HStack,
  Image,
  Tooltip,
} from "@chakra-ui/react";
import { Backer, Buidl, Proposal, Update, User } from "@prisma/client";
import { useWallet } from "@solana/wallet-adapter-react";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import ConnectWallet from "../../src/components/ConnectWallet";
import DepositTokensModal from "../../src/components/DepositTokensModal";
import { prisma } from "../../src/lib/db";
import TimeAgo from "react-timeago";
import { format } from "date-fns";
import VoteModal from "../../src/components/VoteModal";

type BackerWithUser = Backer & { user: User };

interface BuidlPageProps {
  buidl: Buidl;
  updates: Update[];
  backers: BackerWithUser[];
  proposals: Proposal[];
}

const BuidlPage = ({ buidl, updates, proposals, backers }: BuidlPageProps) => {
  const { data: session } = useSession();
  const { publicKey } = useWallet();

  return (
    <VStack gap={16} pb={8}>
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

      <VStack gap={8}>
        <Heading as="h2" fontSize="2xl">
          Backers
        </Heading>
        <VStack gap={4}>
          {backers.map((backer) => (
            <VStack
              key={backer.id}
              border="1px solid"
              borderColor="brand.tertiary"
              bg="brand.secondary"
              rounded="lg"
              minW={["64", "md", "xl"]}
              gap={4}
              py={4}
            >
              <Heading as="h3" fontSize="xl">
                {buidl.token.symbol} {backer.amount}
              </Heading>

              <Text>funded by {backer.user.pubkey}</Text>
            </VStack>
          ))}
        </VStack>
      </VStack>

      <VStack gap={8}>
        <Heading as="h2" fontSize="2xl">
          Updates
        </Heading>
        <VStack gap={4}>
          {updates.map((update) => (
            <VStack
              key={update.id}
              border="1px solid"
              borderColor="brand.tertiary"
              bg="brand.secondary"
              rounded="lg"
              minW={["64", "md", "xl"]}
              gap={4}
              py={4}
            >
              <Heading as="h3" fontSize="xl">
                {update.name}
              </Heading>
              <Text>{update.description}</Text>
            </VStack>
          ))}
        </VStack>
      </VStack>

      <VStack gap={8}>
        <Heading as="h2" fontSize="2xl">
          Proposals
        </Heading>
        <VStack gap={4}>
          {proposals.map((proposal) => (
            <VStack
              key={proposal.id}
              border="1px solid"
              borderColor="brand.tertiary"
              bg="brand.secondary"
              rounded="lg"
              minW={["64", "md", "xl"]}
              gap={4}
              py={4}
            >
              <Heading as="h3" fontSize="xl">
                {proposal.name}
              </Heading>
              <Text>{proposal.purpose}</Text>
              <Text>
                {buidl.token.symbol} {proposal.amount}
              </Text>
              <Text>
                Ends in{" "}
                <span>
                  <TimeAgo date={proposal.endTimestamp} />
                </span>
              </Text>

              {session?.user?.name && publicKey ? (
                <VoteModal proposal={proposal} />
              ) : (
                <ConnectWallet callbackUrl={`/buidls/${buidl.id}`}>
                  Connect Wallet and make sure you have backed the buidl to vote
                </ConnectWallet>
              )}
            </VStack>
          ))}
        </VStack>
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

  const backers = await prisma.backer.findMany({
    where: {
      buidlId: buidl.id,
    },
    include: {
      user: true,
    },
  });

  const updates = await prisma.update.findMany({
    where: {
      buidlId: buidl.id,
    },
  });

  const proposals = await prisma.proposal.findMany({
    where: {
      buidlId: buidl.id,
    },
  });

  return {
    props: {
      buidl: JSON.parse(JSON.stringify(buidl)),
      backers: JSON.parse(JSON.stringify(backers)),
      updates: JSON.parse(JSON.stringify(updates)),
      proposals: JSON.parse(JSON.stringify(proposals)),
    },
  };
};

export default BuidlPage;
