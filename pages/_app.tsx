import "../src/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  GlowWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { useMemo } from "react";

import theme from "../src/theme";
import dynamic from "next/dynamic";

import "../src/styles/wallet-adapter.css";

import { SessionProvider } from "next-auth/react";
import { clusterApiUrl } from "@solana/web3.js";
import Header from "../src/components/Header";

const ReactUIWalletModalProviderDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
  { ssr: false }
);

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new GlowWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    []
  );

  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <ChakraProvider theme={theme}>
        <WalletProvider wallets={wallets} autoConnect>
          <ReactUIWalletModalProviderDynamic>
            <SessionProvider session={session}>
              <Header />
              <Component {...pageProps} />
            </SessionProvider>
          </ReactUIWalletModalProviderDynamic>
        </WalletProvider>
      </ChakraProvider>
    </ConnectionProvider>
  );
}
