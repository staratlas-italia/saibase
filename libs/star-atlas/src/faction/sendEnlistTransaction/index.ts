import { createError } from '@saibase/errors';
import { createVersionedTransaction, getLatestBlockhash } from '@saibase/web3';
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
    TE.Do,
    TE.bind('ix', () =>
      getEnlistInstruction({ connection, factionId, player })
    ),
    TE.bindW('recentBlockhash', () => getLatestBlockhash(connection)),
    TE.map(({ ix, recentBlockhash }) =>
      createVersionedTransaction({
        feePayer: player,
        instructions: [ix],
        recentBlockhash: recentBlockhash.blockhash,
      })
    ),
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
