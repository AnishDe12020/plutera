import {
  Box,
  Button,
  Heading,
  Icon,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Buidl } from "@prisma/client";
import axios from "axios";
import { ExternalLink } from "lucide-react";
import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";

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

const DashboardPage: NextPage<DashboardPageProps> = ({
  buidls: initialBuidls,
}) => {
  const { data: session } = useSession();

  return (
    <VStack gap={8} pb={8}>
      <Heading>Your Buidls</Heading>

      <CreateBuidlModal>New Buidl</CreateBuidlModal>

      <VStack gap={4}>
        {initialBuidls.map((buidl) => (
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

            <Button
              color="white"
              as={Link}
              isExternal
              leftIcon={<Icon as={ExternalLink} />}
              href={`/buidls/${buidl.id}`}
            >
              Go to public page
            </Button>
          </VStack>
        ))}
      </VStack>
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
