import { NextPage } from "next";
import { chakra, Heading, Text } from "@chakra-ui/react";
import Hero from "../src/components/Hero"
import useProgram from "../src/hooks/useProgram";

const Home: NextPage = () => {
  const { program } = useProgram();

  console.log(program);

  return (
    <>
      <Hero/>
    </>
  );
};

export default Home;
