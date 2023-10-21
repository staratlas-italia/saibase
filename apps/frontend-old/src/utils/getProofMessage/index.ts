import { pipe } from 'fp-ts/function';
import { decodeUTF8, encodeBase64 } from 'tweetnacl-util';

export const getProofMessage = (timestamp?: number) =>
  pipe(
    JSON.stringify({
      timestamp: (timestamp ? new Date(timestamp) : new Date())
        .setHours(0, 0, 0, 0)
        .toString(),
    }),
    decodeUTF8,
    encodeBase64
  );
