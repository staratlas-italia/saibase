import type { TaskEitherLeftType } from '@saibase/errors';
import {
  MessageSignerWalletAdapterProps,
  WalletSignTransactionError,
} from '@solana/wallet-adapter-base';
import base58 from 'bs58';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { createError } from '../createError';

export const createProof = ({
  message,
  signMessage,
}: {
  message: string;
  signMessage?: MessageSignerWalletAdapterProps['signMessage'];
}) =>
  pipe(
    O.fromNullable(signMessage),
    TE.fromOption(() =>
      createError('SignMessageUnsupported')('The function is not supported')
    ),
    TE.chainW(
      TE.tryCatchK(
        (signMessage) => signMessage(new TextEncoder().encode(message)),
        createError('SignMessageError')
      )
    ),
    TE.mapLeft((err) => {
      if (
        err.error instanceof WalletSignTransactionError &&
        (err.error.error.code === 4001 || err.error.error.statusCode === 27013)
      ) {
        return createError('UserAbortError')(
          'The user has aborted the request'
        );
      }

      return err;
    }),
    TE.map(base58.encode)
  );

export type CreateProofError = TaskEitherLeftType<
  ReturnType<typeof createProof>
>;
