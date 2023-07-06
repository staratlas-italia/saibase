import { createError } from '@saibase/errors';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';

type Param = {
  connection: Connection;
  owner: PublicKey;
};

export const getSolBalanceByOwner = ({ connection, owner }: Param) =>
  pipe(
    TE.tryCatch(
      () => connection.getBalance(owner),
      createError('GetSolBalanceError')
    ),
    TE.map((lamports) => lamports / LAMPORTS_PER_SOL),
    TE.getOrElse(() => T.of(0))
  );
