import { mints } from '@saibase/constants';
import { getAssociatedTokenAddressSync } from '@solana/spl-token-latest';
import type { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, type Cluster } from '@solana/web3.js';
import { getSaiTokenSwapPdas } from '../getSaiTokenSwapPdas';
import { getSaiTokenSwapProgram } from '../getSaiTokenSwapProgram';

export const getWithdrawProceedsInstruction = async (
  cluster: Cluster,
  connection: Connection,
  wallet: AnchorWallet,
  stateAccount: PublicKey
) => {
  const program = await getSaiTokenSwapProgram(connection, wallet);

  const { proceedsVaultPda } = getSaiTokenSwapPdas(stateAccount);

  const ownerInTokenAccount = getAssociatedTokenAddressSync(
    cluster === 'devnet' ? mints.usdcDevnet : mints.usdc,
    wallet.publicKey
  );

  return program.methods
    .withdrawProceeds()
    .accounts({
      state: stateAccount,
      proceedsVault: proceedsVaultPda,
      owner: wallet.publicKey,
      ownerInTokenAccount,
      mint: cluster === 'devnet' ? mints.usdcDevnet : mints.usdc,
    })
    .instruction();
};
