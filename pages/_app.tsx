import "../src/styles/globals.css";
import type { AppProps } from "next/app";
import { chakra, ChakraProvider } from "@chakra-ui/react";
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
import { QueryClient, QueryClientProvider } from "react-query";

const ReactUIWalletModalProviderDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
  { ssr: false }
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

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
            <QueryClientProvider client={queryClient}>
              <SessionProvider session={session}>
                <Header />
                <chakra.main mt={16} px={[4, 8, 16, 32]}>
                  <Component {...pageProps} />
                </chakra.main>
              </SessionProvider>
            </QueryClientProvider>
          </ReactUIWalletModalProviderDynamic>
        </WalletProvider>
      </ChakraProvider>
    </ConnectionProvider>
  );
}
