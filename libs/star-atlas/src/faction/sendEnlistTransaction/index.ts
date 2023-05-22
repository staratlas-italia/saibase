import { createError } from '@saibase/errors';
import { buildTransaction } from '@saibase/web3';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { FactionType } from '@staratlas/factory';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { getEnlistInstruction } from '../getEnlistInstruction';

type Param = {
  connection: Connection;
  factionId: FactionType;
  player: PublicKey;
  signers: Keypair[];
};

export const sendEnlistTransaction = ({
  connection,
  factionId,
  player,
  signers,
}: Param) =>
  pipe(
    getEnlistInstruction({ connection, factionId, player }),
    TE.map((ix) => [ix]),
    TE.chainW(buildTransaction({ connection, feePayer: player })),
    TE.map((tx) => {
      tx.sign(signers);

      return tx;
    }),
    TE.chainW((signedTx) =>
      TE.tryCatch(
        () =>
          connection.sendTransaction(signedTx, {
            skipPreflight: true,
            preflightCommitment: 'recent',
          }),
        createError('SendTransactionError')
      )
    )
  );
