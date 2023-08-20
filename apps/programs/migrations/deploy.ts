// Migrations are an early feature. Currently, they're nothing more than this
// single deploy script that's invoked from the CLI, injecting a provider
// configured from the workspace's Anchor.toml.

import {
  AnchorProvider,
  BN,
  getProvider,
  Program,
  setProvider,
  workspace,
} from '@project-serum/anchor';
import { mintTo } from '@solana/spl-token-latest';
import { Keypair, PublicKey } from '@solana/web3.js';
import { SaiTokenSwap } from '../target/types/sai_token_swap';
import { createVaultPdas } from './createVaultPdas';
import { loadKeypair } from './loadKeypair';

module.exports = async function (provider) {
  setProvider(provider);

  const program = workspace.SaiCitizenship as Program<SaiTokenSwap>;

  const endpoint = provider.connection.rpcEndpoint;

  if (endpoint.includes('localhost') || endpoint.includes('devnet')) {
    await initDevnet(program);
  } else {
    // TODO: mainnet
  }
};

async function initDevnet(program: Program<SaiTokenSwap>) {
  const owner = await loadKeypair('/Users/at0706/.config/solana/devnet.json');

  const udscDevMint = new PublicKey(
    'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'
  );

  const token_mint1 = new PublicKey(
    'FCNy7oyjevsCbHbL2cgDJeWrmd3wWTDeq4u4uafCNUuu'
  );

  const token_mint2 = new PublicKey(
    'EVWyAZNy32GnB9GZEcnGsawii4NfnC6KPsaRCGM7g8sx'
  );

  const token_mint3 = new PublicKey(
    '7n4rgd4WVNvzFom7UFqjCa9fpMB9apP8Gz3zX3aS6VEr'
  );

  const { vaultPda: vaultPda1 } = await initSwap(
    program,
    owner,
    token_mint1,
    udscDevMint
  );
  const { vaultPda: vaultPda2 } = await initSwap(
    program,
    owner,
    token_mint2,
    udscDevMint
  );
  const { vaultPda: vaultPda3 } = await initSwap(
    program,
    owner,
    token_mint3,
    udscDevMint
  );

  Promise.all([
    mintTo(
      (program.provider as AnchorProvider).connection,
      owner,
      token_mint1,
      vaultPda1,
      owner,
      100
    ),
    mintTo(
      (program.provider as AnchorProvider).connection,
      owner,
      token_mint2,
      vaultPda2,
      owner,
      100
    ),
    mintTo(
      (program.provider as AnchorProvider).connection,
      owner,
      token_mint3,
      vaultPda3,
      owner,
      100
    ),
  ]);
}

async function initSwap(
  program: Program<SaiTokenSwap>,
  owner: Keypair,
  tokenMint: PublicKey,
  proceedsMint: PublicKey
) {
  const stateAccount = Keypair.generate();

  const provider = getProvider();

  const { vaultPda, proceedsVaultPda } = await createVaultPdas(
    program,
    stateAccount.publicKey
  );

  await program.methods
    .initializeSwap(new BN(15 * Math.pow(10, 6)), new BN(1))
    .accounts({
      mint: tokenMint,
      owner: owner.publicKey,
      proceedsMint: proceedsMint,
      proceedsVault: proceedsVaultPda,
      state: stateAccount.publicKey,
      vault: vaultPda,
    })
    .signers([stateAccount, owner])
    .rpc();

  console.log('Program: ', program.programId.toString());
  console.log('Swap state: ', stateAccount.publicKey.toString());
  console.log('Owner: ', owner.publicKey.toString());
  console.log('Vault mint: ', tokenMint.toString());
  console.log('Vault: ', vaultPda.toString());
  console.log('Proceeds Vault: ', proceedsVaultPda.toString());
  console.log('Proceeds mint: ', proceedsMint.toString());

  return { vaultPda, stateAccount };
}
