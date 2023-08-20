import { createError } from '@saibase/errors';
import { Connection, PublicKey } from '@solana/web3.js';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
type Param = {
  account: PublicKey;
  connection: Connection;
};

export const getAccountInfo = ({ account, connection }: Param) =>
  pipe(
    TE.tryCatch(
      () => connection.getAccountInfo(account),
      createError('GetAccountInfoError')
    )
  );
