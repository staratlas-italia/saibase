import { parsePublicKey } from '@saibase/web3';
import { serialize } from 'cookie';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { corsMiddleware } from '../../../middlewares/cors';
import { matchMethodMiddleware } from '../../../middlewares/matchMethod';
import { matchSignatureMiddleware } from '../../../middlewares/matchSignature';
import { handleErrors } from '../../../utils/handleErrors';

// const collection = mongo.collection<RefreshToken>('sage-tokens');

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const pbk = req.body.publicKey as string;
  const realPbkEither = parsePublicKey(pbk);

  try {
    if (!pbk || E.isLeft(realPbkEither)) {
      throw new Error('MissingInvalidParam');
    }

    const accessToken = jwt.sign(
      { publicKey: pbk },
      process.env.JWT_ACCESS_SECRET ?? '',
      {
        expiresIn: '1d',
      }
    );

    /* const refreshToken = jwt.sign(
    { publicKey },
    process.env.JWT_REFRESH_SECRET ?? '',
    {
      expiresIn: '7d',
    }
  );

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);

  try {
    const saveRefreshToken = await collection.insertOne({
      token: refreshToken,
      userId: publicKey,
      expires: expiryDate,
    });

    if (!saveRefreshToken.insertedId) {
      res
        .status(400)
        .json({ status: 400, error: 'The operation encountered an error' });
      return;
    }
  } catch (err) {
    res.status(500).json({ status: 500, error: 'Internal Server Error' });
    return;
  }

  res.setHeader(
    'Set-Cookie',
    serialize('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
      path: '/api/token/refresh',
      secure: true,
      sameSite: 'strict',
    })
  ); */

    res.setHeader(
      'Set-Cookie',
      serialize('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60,
        path: '/',
        secure: true,
        sameSite: 'strict',
      })
    );

    res.json({});
  } catch (err) {
    err instanceof Error
      ? handleErrors(err, res)
      : handleErrors(new Error('An unexpected error occurred.'), res);
  }
};

export default corsMiddleware(
  pipe(handler, matchMethodMiddleware(['POST']), matchSignatureMiddleware)
);
