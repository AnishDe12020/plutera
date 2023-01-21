import { useWallet } from "@solana/wallet-adapter-react";
import { useAsyncMemo } from "use-async-memo";
import { SocialProtocol, ProtocolOptions } from "@spling/social-protocol";
import { useMemo } from "react";

const useSocialProtocol = () => {
  const wallet = useWallet();

  const options: ProtocolOptions = useMemo(
    () => ({
      rpcUrl: "https://api.mainnet-beta.solana.com/",
      useIndexer: true,
    }),
    []
  );

  const socialProtocol = useAsyncMemo(async () => {
    const data = new SocialProtocol(wallet, null, options).init();
  }, []);

  return {
    socialProtocol,
  };
};

export default useSocialProtocol;
