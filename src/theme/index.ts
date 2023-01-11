import { extendTheme } from "@chakra-ui/react";
import { accentPurple, accentTokens, mainColors, stateColors } from "./colors";
import { components } from "./components";

const theme = extendTheme({
  components,
  colors: { ...accentPurple },
  semanticTokens: {
    colors: { ...mainColors, ...accentTokens, ...stateColors },
  },
  config: {
    initialColorMode: "dark",
  },
  styles: {
    global: {
      "html, body": {
        background: "brand.primary",
      },
    },
  },
});

export default theme;
