import { AnchorProvider, Program } from '@project-serum/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { saiTokenSwapProgramId } from '../../constants';
import { saiTokenSwapIdl } from '../../idl';

export const getSaiTokenSwapProgram = (
  connection: Connection,
  wallet: AnchorWallet
) => {
  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );

  return new Program(saiTokenSwapIdl, saiTokenSwapProgramId, provider);
};
