import {
  Image,
  Text,
  useRadio,
  chakra,
  RadioProps,
  VStack,
} from "@chakra-ui/react";

interface TokenRadioProps extends RadioProps {
  logoURI: string;
  symbol: string;
}

const TokenRadio = ({ logoURI, symbol, ...radioProps }: TokenRadioProps) => {
  const { state, getInputProps, getCheckboxProps, htmlProps, getLabelProps } =
    useRadio(radioProps);

  return (
    <chakra.label {...htmlProps} cursor="pointer">
      <input {...getInputProps()} hidden />
      <VStack
        {...getCheckboxProps()}
        bg={state.isChecked ? "brand.quaternary" : "brand.secondary"}
        _hover={{
          bg: "brand.tertiary",
        }}
        rounded="lg"
        h={24}
        w={24}
        border="1px solid"
        borderColor="brand.tertiary"
        p={4}
      >
        <Image
          src={logoURI}
          alt={symbol}
          h={8}
          w={8}
          rounded="full"
          mb={1}
          {...getLabelProps()}
        />
        <Text>{symbol}</Text>
      </VStack>
    </chakra.label>
  );
};

export default TokenRadio;
