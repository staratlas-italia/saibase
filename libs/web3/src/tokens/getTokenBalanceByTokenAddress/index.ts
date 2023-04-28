import { Connection, PublicKey } from '@solana/web3.js';
import { constVoid, pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';

type Param = { connection: Connection; address: PublicKey };

export const getTokenBalanceByTokenAddress = ({ connection, address }: Param) =>
  pipe(
    TE.tryCatch(() => connection.getTokenAccountBalance(address), constVoid),
    TE.fold(
      () => T.of(0),
      (response) => T.of(response.value.uiAmount || 0)
    )
  );
