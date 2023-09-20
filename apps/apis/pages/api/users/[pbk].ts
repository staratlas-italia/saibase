import { parsePublicKey } from '@saibase/web3';
import crypto from 'crypto';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../../common/types';
import { corsMiddleware } from '../../../middlewares/cors';
import { matchApiKeyMiddleware } from '../../../middlewares/matchApiKey';
import { matchMethodMiddleware } from '../../../middlewares/matchMethod';
import { mongo } from '../../../mongodb';
import { handleErrors } from '../../../utils/handleErrors';

const collection = mongo.collection<User>('sage-users');

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const pbk = req.query.pbk as string;
  const realPbkEither = parsePublicKey(pbk);

  try {
    if (!pbk || E.isLeft(realPbkEither)) {
      throw new Error('MissingInvalidParam');
    }

    switch (req.method) {
      case 'GET': {
        const users = await collection.find({ publicKey: pbk }).toArray();

        if (users.length === 0) {
          res.status(200).json({});
          return;
        }

        res.status(200).json({
          publicKey: users[0].publicKey,
          currentNonce: users[0].currentNonce,
        });
        break;
      }
      case 'POST': {
        const users = await collection.find({ publicKey: pbk }).toArray();

        if (users.length !== 0) {
          throw new Error('UserAlreadyExists');
        }

        const randomNonce = crypto.randomBytes(32).toString('hex');

        const newUser = await collection.insertOne({
          publicKey: pbk,
          currentNonce: randomNonce,
          premium: false,
        });

        res.status(200).json(newUser);
        break;
      }
      default:
        return;
    }
  } catch (err) {
    err instanceof Error
      ? handleErrors(err, res)
      : handleErrors(new Error('An unexpected error occurred.'), res);
  }
};

export default pipe(
  handler,
  corsMiddleware,
  matchMethodMiddleware(['GET', 'POST']),
  matchApiKeyMiddleware
);
