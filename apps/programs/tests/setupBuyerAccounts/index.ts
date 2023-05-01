import * as anchor from "@project-serum/anchor";
import {
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { SaiTokenSwap } from "../../target/types/sai_token_swap";
import { airdrop } from "../airdrop";

export const setupBuyerAccounts = async (
  program: anchor.Program<SaiTokenSwap>,
  buyer: anchor.web3.Keypair,
  mintOwner: anchor.web3.Keypair,
  usdcMint: anchor.web3.PublicKey,
  otherTokenMint: anchor.web3.PublicKey
) => {
  await airdrop(program, buyer.publicKey);

  const programProvider = program.provider as anchor.AnchorProvider;

  const buyerUsdcTokenAccount = await getOrCreateAssociatedTokenAccount(
    programProvider.connection,
    mintOwner,
    usdcMint,
    buyer.publicKey
  );

  const buyerOtherTokenAccount = await getAssociatedTokenAddress(
    otherTokenMint,
    buyer.publicKey
  );

  return {
    buyerUsdcTokenAccount,
    buyerOtherTokenAccount: { address: buyerOtherTokenAccount },
  };
};
