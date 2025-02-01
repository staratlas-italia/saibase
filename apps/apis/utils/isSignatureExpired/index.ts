import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { parseMessage } from '../parseMessage';

export const isSignatureExpired = (base64Message: string) =>
  pipe(
    parseMessage(base64Message),
    E.fromNullable(new Error('Invalid message.')),
    E.map(
      ({ timestamp }) =>
        Date.now() > Number(timestamp) + 7 * 24 * 60 * 60 * 1000
    ),
    E.getOrElse(() => true)
  );
