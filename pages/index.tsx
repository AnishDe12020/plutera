import { NextPage } from "next";
import { chakra, Heading, Text } from "@chakra-ui/react";
import useProgram from "../src/hooks/useProgram";

const Home: NextPage = () => {
  const { program } = useProgram();

  console.log(program);

  return (
    <>
      <Heading>Sandstorm project</Heading>
      <Text>on-chain transparent fundraising</Text>
    </>
  );
};

export default Home;
