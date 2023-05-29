import {
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';

type Param = {
  feePayer: PublicKey;
  recentBlockhash: string;
  instructions: TransactionInstruction[];
};

export const createVersionedTransaction = ({
  feePayer,
  recentBlockhash,
  instructions,
}: Param) => {
  const messageV0 = new TransactionMessage({
    payerKey: feePayer,
    recentBlockhash,
    instructions: instructions,
  }).compileToV0Message();

  return new VersionedTransaction(messageV0);
};
