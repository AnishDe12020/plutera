import { Heading } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

import CreateBuidlModal from "../../src/components/CreateBuidlModal";
import CreateProposalModal from "../../src/components/CreateProposalModal";
import EditBuidlModal from "../../src/components/EditBuidlModal";
import CreaeUpdateModal from "../../src/components/PostUpdateModal";
import VoteModal from "../../src/components/VoteModal";

import { authOptions } from "../api/auth/[...nextauth]";

const DashboardPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Heading>Your Buidls</Heading>
      {/* TODO: fetch builds on server side and display here */}
      <CreateBuidlModal>New Buidl</CreateBuidlModal>
      <EditBuidlModal previousBuidl={{ name: "test", description: "desc" }}>
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
