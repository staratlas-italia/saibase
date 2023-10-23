import { AnchorProvider } from '@project-serum/anchor';
import { fakeNodeWallet } from '@saibase/web3';
import { Connection } from '@solana/web3.js';

export const buildAnchorProvider = (
  connection: Connection,
  wallet = fakeNodeWallet
) => new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
