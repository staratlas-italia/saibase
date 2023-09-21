import * as E from 'fp-ts/Either';
import * as J from 'fp-ts/Json';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { decodeBase64, encodeUTF8 } from 'tweetnacl-util';

const messageCodec = t.type({
  timestamp: t.string,
});

export const parseMessage = (base64Message: string) =>
  pipe(
    E.tryCatch(
      () => pipe(base64Message, decodeBase64, encodeUTF8),
      () => new Error("Can't decode base64 message.")
    ),
    E.chain(J.parse),
    E.chainW(messageCodec.decode),
    E.getOrElseW(() => null)
  );
