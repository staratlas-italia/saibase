import { allowedOrigins } from '@saibase/constants';
import {
  corsMiddleware,
  matchMethodMiddleware,
  matchSignatureMiddleware,
} from '@saibase/middlewares';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { NextApiRequest, NextApiResponse } from 'next';
import { isSignatureExpired } from '../../../utils/isSignatureExpired';

export const messageCodec = t.type({
  timestamp: t.string,
});

const handler = matchSignatureMiddleware(
  ({ signature, publicKey, message: base64Message }) =>
    async (_: NextApiRequest, res: NextApiResponse) => {
      const isMessageInvalidOrExpired = isSignatureExpired(base64Message);

      if (isMessageInvalidOrExpired) {
        return res
          .status(400)
          .json({ status: 400, error: 'This signature is expired' });
      }

      return res.status(200).json({
        status: 200,
        token: `${base64Message}.${publicKey}.${signature}`,
      });
    }
);

export default pipe(
  handler,
  corsMiddleware([...allowedOrigins]),
  matchMethodMiddleware(['POST'])
);
