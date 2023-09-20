import { fetchPlayer } from '@saibase/star-atlas';
import { parsePublicKey } from '@saibase/web3';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { JwtUserPayload } from '../../../common/types';
import { authenticateMiddleware } from '../../../middlewares/authenticate';
import { corsMiddleware } from '../../../middlewares/cors';
import { matchMethodMiddleware } from '../../../middlewares/matchMethod';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.cookies.accessToken!;

  const payload = jwt.decode(token) as JwtUserPayload;
  const pbk = payload.publicKey;

  const result = await pipe(
    parsePublicKey(pbk),
    TE.fromEither,
    TE.chainW((publicKey) => fetchPlayer(publicKey)),
    TE.map((response) => response.data)
  )();

  if (E.isLeft(result)) {
    return res.status(200).json({});
  }

  res.status(200).json(result.right);
};

export default pipe(
  handler,
  corsMiddleware,
  matchMethodMiddleware(['GET']),
  authenticateMiddleware
);
