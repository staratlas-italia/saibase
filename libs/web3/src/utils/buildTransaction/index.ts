import { createError } from '@saibase/errors';
import {
  Connection,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

const getLatestBlockhash = (connection: Connection) =>
  TE.tryCatch(
    () => connection.getLatestBlockhash(),
    createError('GetLatestBlockhashError')
  );

type Param = {
  connection: Connection;
  feePayer: PublicKey;
};

export const buildTransaction =
  ({ connection, feePayer }: Param) =>
  (instructions: TransactionInstruction[]) =>
    pipe(
      getLatestBlockhash(connection),
      TE.map(({ blockhash }) => {
        const messageV0 = new TransactionMessage({
          payerKey: feePayer,
          recentBlockhash: blockhash,
          instructions: instructions,
        }).compileToV0Message();

        return new VersionedTransaction(messageV0);
      })
    );
