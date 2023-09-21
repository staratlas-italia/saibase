import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { parseMessage } from '../parseMessage';

export const isSignatureExpired = (base64Message: string) =>
  pipe(
    parseMessage(base64Message),
    E.fromNullable(new Error('Invalid message.')),
    E.map(({ timestamp }) => Date.now() > Number(timestamp) + 86_400_000),
    E.getOrElse(() => true)
  );
