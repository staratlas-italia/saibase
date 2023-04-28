import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import { constVoid, pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { getTokenBalanceByTokenAddress } from '../getTokenBalanceByTokenAddress';

type Param = { connection: Connection; tokenAccountPubkey: PublicKey };

export const getTokenBalanceByTokenMint = ({
  connection,
  tokenAccountPubkey,
}: Param) =>
  pipe(
    TE.tryCatch(
      () => connection.getTokenAccountBalance(tokenAccountPubkey),
      constVoid
    ),
    TE.fold(
      () => T.of(0),
      (response) => T.of(response.value.uiAmount || 0)
    )
  );

export const getTokenBalanceByMint = (
  connection: Connection,
  owner: PublicKey,
  mint: PublicKey
) => {
  return pipe(
    T.of(getAssociatedTokenAddressSync(mint, owner)),
    T.chain((address) => getTokenBalanceByTokenAddress({ connection, address }))
  );
};
