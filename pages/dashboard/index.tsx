import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { Buidl } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

import CreateBuidlModal from "../../src/components/CreateBuidlModal";
import CreateProposalModal from "../../src/components/CreateProposalModal";
import DepositTokensModal from "../../src/components/DepositTokensModal";
import EditBuidlModal from "../../src/components/EditBuidlModal";
import CreaeUpdateModal from "../../src/components/PostUpdateModal";
import VoteModal from "../../src/components/VoteModal";
import { prisma } from "../../src/lib/db";

import { authOptions } from "../api/auth/[...nextauth]";

interface DashboardPageProps {
  buidls: Buidl[];
}

const DashboardPage: NextPage<DashboardPageProps> = ({ buidls }) => {
  const { data: session } = useSession();

  return (
    <VStack gap={8}>
      <Heading>Your Buidls</Heading>

      <CreateBuidlModal>New Buidl</CreateBuidlModal>

      <VStack gap={4}>
        {buidls.map((buidl) => (
          <VStack
            key={buidl.id}
            border="1px solid"
            borderColor="brand.tertiary"
            bg="brand.secondary"
            rounded="lg"
            minW={["64", "md", "xl"]}
            gap={4}
            py={8}
          >
            <Heading fontSize="2xl">{buidl.name}</Heading>
            <Text>{buidl.description}</Text>

            <EditBuidlModal previousBuidl={buidl}>Edit Buidl</EditBuidlModal>

            <CreateProposalModal buidl={buidl}>
              Create Proposal
            </CreateProposalModal>

            <CreaeUpdateModal buidl={buidl}>Post Update</CreaeUpdateModal>
          </VStack>
        ))}
      </VStack>

      {/* <EditBuidlModal previousBuidl={{ name: "test", description: "desc" }}>
        Edit Buidl
      </EditBuidlModal>
      <CreateProposalModal buidl={{ address: "gwerhiogh", token: "USDC" }}>
        Create Proposal
      </CreateProposalModal>

      <VoteModal
        proposal={{
          address: "fwer",
          name: "test proposal",
          purpose:
            "Commodo dolor pariatur voluptate velit excepteur commodo minim mollit eiusmod elit commodo laborum consequat. Quis sit commodo et id labore cupidatat ex enim non proident cillum tempor et. Duis minim enim nostrud mollit est dolore eu voluptate pariatur tempor nulla. Sit irure dolore ipsum incididunt exercitation. Ut aliqua quis sint sit ipsum ex nulla mollit nisi occaecat in cillum esse laboris.",
        }}
      >
        Vote
      </VoteModal>
      <CreaeUpdateModal buidl={{ address: "wer", updatesTillNow: 69 }}>
        Post Update
      </CreaeUpdateModal>
      <DepositTokensModal
        buidl={{
          amountRequested: 10000,
          amountFundedTillNow: 3000,
          address: "erw",
          token: "USDC",
        }}
      >
        Deposit Tokens
      </DepositTokensModal> */}
    </VStack>
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

  const buidls = await prisma.buidl.findMany({
    where: {
      owner: {
        pubkey: session.user.name,
      },
    },
  });

  return {
    props: { buidls: JSON.parse(JSON.stringify(buidls)) },
  };
};

export default DashboardPage;
