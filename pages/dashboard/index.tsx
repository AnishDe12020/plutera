import { Heading } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

import CreateBuidlModal from "../../src/components/CreateBuidlModal";
import EditBuidlModal from "../../src/components/EditBuidlModal";

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
