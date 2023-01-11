import { NextPage } from "next";
import { Box, chakra, Heading, Text } from "@chakra-ui/react";

const Home: NextPage = () => {
  return (
    <chakra.main mt={16} px={[4, 8, 16, 32]}>
      <Heading>Sandstorm project</Heading>
      <Text>on-chain transparent fundraising</Text>
    </chakra.main>
  );
};

export default Home;
