import { PublicKey, Transaction } from '@solana/web3.js';

type FakeNodeWallet = {
  signTransaction: (_: Transaction) => Promise<Transaction>;
  signAllTransactions: (_: Transaction[]) => Promise<Transaction[]>;
  publicKey: PublicKey;
};

export const fakeNodeWallet: FakeNodeWallet = {
  signTransaction: () => Promise.resolve(new Transaction()),
  signAllTransactions: () => Promise.resolve([]),
  publicKey: new PublicKey('saiQr2S4nVMfhsaJYmTMSdVwaB1PbqjYsCDX1FnDJon'),
};
