import * as anchor from "@project-serum/anchor";
import { SaiTokenSwap } from "../../target/types/sai_token_swap";

export const createVaultPdas = async (
  program: anchor.Program<SaiTokenSwap>,
  stateAccount: anchor.web3.PublicKey
) => {
  const [vaultPda] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("vault"), stateAccount.toBuffer()],
    program.programId
  );
  const [proceedsVaultPda] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("proceeds_vault"), stateAccount.toBuffer()],
    program.programId
  );

  return {
    vaultPda,
    proceedsVaultPda,
  };
};
