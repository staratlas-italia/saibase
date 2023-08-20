import { createError } from '@saibase/errors';
import { Connection } from '@solana/web3.js';
import * as TE from 'fp-ts/TaskEither';

export const getLatestBlockhash = (connection: Connection) =>
  TE.tryCatch(
    () => connection.getLatestBlockhash(),
    createError('GetLatestBlockhashError')
  );
