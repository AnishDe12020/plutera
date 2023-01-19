import { NextPage } from "next";
import { chakra, Heading, Text } from "@chakra-ui/react";
import useProgram from "../src/hooks/useProgram";

const Home: NextPage = () => {
  const { program } = useProgram();

  console.log(program);

  return (
    <chakra.main mt={16} px={[4, 8, 16, 32]}>
      <Heading>Sandstorm project</Heading>
      <Text>on-chain transparent fundraising</Text>
    </chakra.main>
  );
};

export default Home;
