import * as TE from 'fp-ts/TaskEither';

export * from './createError';

export type TaskEitherLeftType<M extends TE.TaskEither<unknown, unknown>> =
  Extract<Awaited<ReturnType<M>>, { _tag: 'Left' }>['left'];

export type TaskEitherRightType<M extends TE.TaskEither<unknown, unknown>> =
  Extract<Awaited<ReturnType<M>>, { _tag: 'Right' }>['right'];

export type ExtractErrors<
  F extends (...args: unknown[]) => TE.TaskEither<unknown, unknown>
> = TaskEitherLeftType<ReturnType<F>>;
