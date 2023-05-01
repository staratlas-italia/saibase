import * as anchor from "@project-serum/anchor";
import { createMint } from "@solana/spl-token";

export const createTokenMint = async (
  connection: anchor.web3.Connection,
  mintOwner: anchor.web3.Keypair,
  decimals: number
) => {
  const mint = await createMint(
    connection,
    mintOwner,
    mintOwner.publicKey,
    mintOwner.publicKey,
    decimals
  );

  return mint;
};
