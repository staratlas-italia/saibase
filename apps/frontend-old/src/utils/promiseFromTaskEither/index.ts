import * as E from 'fp-ts/Either';
import type * as TE from 'fp-ts/TaskEither';

export const promiseFromTaskEither = <E, A>(ma: TE.TaskEither<E, A>) =>
  ma().then(E.getOrElseW((e) => Promise.reject(e)));
