import {
  MessageSignerWalletAdapterProps,
  WalletSignTransactionError,
} from '@solana/wallet-adapter-base';
import base58 from 'bs58';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { Lazy, pipe } from 'fp-ts/function';
import { createError } from '../createError';

export const safeFn = <A, B, C extends string>({
  fn,
  unsupportedErrorCode,
}: {
  fn?: (_: A) => Promise<B>;
  unsupportedErrorCode: C;
}) =>
  pipe(
    O.fromNullable(fn),
    TE.fromOption(() =>
      createError(unsupportedErrorCode)('The function is not supported')
    )
  );

const mapIfUserAbort =
  <A, B extends { type: string; error: Error }, E>(te: Lazy<E>) =>
  (ma: TE.TaskEither<B, A>) => {
    return pipe(
      ma,
      TE.mapLeft((err) => {
        if (
          err.error instanceof WalletSignTransactionError &&
          (err.error.error.code === 4001 ||
            err.error.error.statusCode === 27013)
        ) {
          return te();
        }

        return err;
      })
    );
  };

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
    mapIfUserAbort(() =>
      createError('UserAbortError')('The user has aborted the request')
    ),
    TE.map(base58.encode)
  );

export type TaskEitherLeftType<M extends TE.TaskEither<unknown, unknown>> =
  Extract<Awaited<ReturnType<M>>, { _tag: 'Left' }>['left'];

export type CreateProofError = TaskEitherLeftType<
  ReturnType<typeof createProof>
>;
