import { Connection, PublicKey } from '@solana/web3.js';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { getAccountInfo } from '../getAccountInfo';

type Param = {
  account: PublicKey;
  connection: Connection;
};

export const existsAccount = ({ account, connection }: Param) =>
  pipe(
    getAccountInfo({ connection, account }),
    TE.fold(
      () => T.of(false),
      (account) => T.of(Boolean(account))
    )
  );
