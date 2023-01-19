import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import { AnchorProvider, Program } from "@project-serum/anchor";
import { IDL, Plutera } from "../idl/plutera";

export const PROGRAM_ID = "Fb4whnaA3YYjRYYFfCkYhNSwWaBX9hchS8AY5p1VF26W";

const useProgram = () => {
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();

  const anchorProvider = useMemo(() => {
    if (!anchorWallet) return;

    return new AnchorProvider(connection, anchorWallet, {
      commitment: "confirmed",
    });
  }, [connection, anchorWallet]);

  const anchorProgram: Program<Plutera> | undefined = useMemo(() => {
    if (!anchorProvider) return;

    return new Program(IDL, PROGRAM_ID, anchorProvider);
  }, [anchorProvider]);

  return {
    program: anchorProgram,
  };
};

export default useProgram;
