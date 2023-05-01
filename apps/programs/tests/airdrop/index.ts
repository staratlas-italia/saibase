import * as anchor from '@project-serum/anchor';
import { SaiTokenSwap } from '../../target/types/sai_token_swap';

export const airdrop = async (
  program: anchor.Program<SaiTokenSwap>,
  destination: anchor.web3.PublicKey
) => {
  const provider = program.provider as anchor.AnchorProvider;

  let txFund = new anchor.web3.Transaction();

  txFund.add(
    anchor.web3.SystemProgram.transfer({
      fromPubkey: provider.wallet.publicKey,
      toPubkey: destination,
      lamports: 5 * anchor.web3.LAMPORTS_PER_SOL,
    })
  );

  const tx = await provider.sendAndConfirm(txFund);
};
