import { allowedOrigins } from '@saibase/constants';
import { corsMiddleware, matchMethodMiddleware } from '@saibase/middlewares';
import { fetchPlayer } from '@saibase/star-atlas';
import { parsePublicKey } from '@saibase/web3';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateMiddleware } from '../../../middlewares/authenticate';

const handler = authenticateMiddleware(
  ({ publicKey }) =>
    async (_: NextApiRequest, res: NextApiResponse) => {
      const result = await pipe(
        parsePublicKey(publicKey),
        TE.fromEither,
        TE.chainW((publicKey) => fetchPlayer(publicKey)),
        TE.map((response) => response.data)
      )();

      if (E.isLeft(result)) {
        return res.status(200).json({});
      }

      res.status(200).json(result.right);
    }
);

export default pipe(
  handler,
  corsMiddleware([...allowedOrigins]),
  matchMethodMiddleware(['GET'])
);
