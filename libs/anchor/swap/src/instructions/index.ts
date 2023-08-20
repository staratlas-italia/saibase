import { BN } from '@project-serum/anchor';
import { mints } from '@saibase/constants';
import { getAssociatedTokenAddress } from '@solana/spl-token-latest';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Cluster, Connection, Keypair, PublicKey } from '@solana/web3.js';
import { AnchorTypes } from '@staratlas/factory/dist/anchor/types';
import { SaiTokenSwapIdl } from '../idl';
import { getSaiTokenSwapPdas } from './getSaiTokenSwapPdas';
import { getSaiTokenSwapProgram } from './getSaiTokenSwapProgram';

type SwapTypes = AnchorTypes<SaiTokenSwapIdl>;

type SwapState = SwapTypes['Accounts']['state'];

export const getAllSwapStates = async (
  connection: Connection,
  wallet: AnchorWallet
): Promise<{ account: SwapState; publicKey: PublicKey }[]> => {
  return getSaiTokenSwapProgram(connection, wallet).account.state.all([
    { memcmp: { offset: 50, bytes: wallet.publicKey.toString() } },
  ]);
};

export const fetchSwapPrice = async (
  connection: Connection,
  wallet: AnchorWallet,
  stateAccount: PublicKey
) => {
  return getSaiTokenSwapProgram(connection, wallet).account.state.fetch(
    stateAccount
  );
};

export const initilizeSwap = async (
  connection: Connection,
  wallet: AnchorWallet,
  proceedsMint: PublicKey,
  mint: PublicKey,
  price: number
) => {
  const stateAccount = Keypair.generate();

  const { vaultPda, proceedsVaultPda } = getSaiTokenSwapPdas(
    stateAccount.publicKey
  );

  return getSaiTokenSwapProgram(connection, wallet)
    .methods.initializeSwap(new BN(price * Math.pow(10, 6)))
    .accounts({
      state: stateAccount.publicKey,
      mint,
      owner: wallet.publicKey,
      vault: vaultPda,
      proceedsVault: proceedsVaultPda,
      proceedsMint,
    })
    .signers([stateAccount])
    .rpc();
};

export const swapToken = async (
  cluster: Cluster,
  connection: Connection,
  wallet: AnchorWallet,
  stateAccount: PublicKey,
  mint: PublicKey,
  amount = 1
) => {
  const { vaultPda, proceedsVaultPda } = getSaiTokenSwapPdas(stateAccount);

  const buyerOutTokenAccount = await getAssociatedTokenAddress(
    cluster === 'devnet' ? mints.usdcDevnet : mints.usdc,
    wallet.publicKey
  );

  const buyerInTokenAccount = await getAssociatedTokenAddress(
    mint,
    wallet.publicKey
  );

  return getSaiTokenSwapProgram(connection, wallet)
    .methods.swap(new BN(amount))
    .accounts({
      mint,
      buyerInTokenAccount,
      buyerOutTokenAccount,
      state: stateAccount,
      buyer: wallet.publicKey,
      vault: vaultPda,
      proceedsVault: proceedsVaultPda,
    })
    .transaction();
};

export const startOrStopSell = async (
  connection: Connection,
  wallet: AnchorWallet,
  stateAccount: PublicKey
) => {
  const program = await getSaiTokenSwapProgram(connection, wallet);

  const state = await program.account.state.fetch(stateAccount);

  if (state.active) {
    await program.methods
      .stopSale()
      .accounts({
        owner: wallet.publicKey,
        state: stateAccount,
      })
      .rpc();
  } else {
    await program.methods
      .startSale()
      .accounts({
        owner: wallet.publicKey,
        state: stateAccount,
      })
      .rpc();
  }

  return {
    account: await program.account.state.fetch(stateAccount, 'confirmed'),
    publicKey: stateAccount,
  };
};

export const withdrawProceeds = async (
  cluster: Cluster,
  connection: Connection,
  wallet: AnchorWallet,
  stateAccount: PublicKey
) => {
  const program = await getSaiTokenSwapProgram(connection, wallet);

  const { proceedsVaultPda } = getSaiTokenSwapPdas(stateAccount);

  const ownerInTokenAccount = await getAssociatedTokenAddress(
    cluster === 'devnet' ? mints.usdcDevnet : mints.usdc,
    wallet.publicKey
  );

  await program.methods
    .withdrawProceeds()
    .accounts({
      state: stateAccount,
      proceedsVault: proceedsVaultPda,
      owner: wallet.publicKey,
      ownerInTokenAccount,
      mint: cluster === 'devnet' ? mints.usdcDevnet : mints.usdc,
    })
    .rpc();
};
