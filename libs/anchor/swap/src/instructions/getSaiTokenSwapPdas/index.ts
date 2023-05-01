import { PublicKey } from '@solana/web3.js';
import { saiTokenSwapProgramId } from '../../constants';

export const getSaiTokenSwapPdas = (stateAccount: PublicKey) => {
  const [vaultPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('vault'), stateAccount.toBuffer()],
    saiTokenSwapProgramId
  );

  const [proceedsVaultPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('proceeds_vault'), stateAccount.toBuffer()],
    saiTokenSwapProgramId
  );

  return { proceedsVaultPda, vaultPda };
};
