import type { Connection, PublicKey } from "@solana/web3.js";
import { findAssociatedTokenAddress } from "../findAssociatedTokenAddress";
import { getTokenBalance } from "../getTokenBalance";

export const getTokenBalanceByMint = async (
  connection: Connection,
  walletPbk: PublicKey,
  tokenMintPbk: PublicKey
): Promise<number> => {
  const associatedTokenPbk = await findAssociatedTokenAddress(
    walletPbk,
    tokenMintPbk
  );
  return await getTokenBalance(connection, associatedTokenPbk);
};
