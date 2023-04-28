import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { parsePublicKey } from '../parsePublicKey';

export const isPublicKey = (pk: string) =>
  pipe(
    parsePublicKey(pk),
    E.fold(
      () => false,
      () => true
    )
  );
