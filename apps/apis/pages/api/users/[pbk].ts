import { allowedOrigins } from '@saibase/constants';
import { corsMiddleware, matchMethodMiddleware } from '@saibase/middlewares';
import { parsePublicKey } from '@saibase/web3';
import crypto from 'crypto';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../../common/types';
import { mongo } from '../../../mongodb';
import { handleErrors } from '../../../utils/handleErrors';

// TODO: move this di @saibase/sai-database
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
        const user = await collection.findOne({ publicKey: pbk });

        if (!user) {
          res.status(404).json({ error: 'User not found' });
          return;
        }

        res.status(200).json({
          publicKey: user.publicKey,
          currentNonce: user.currentNonce,
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
  corsMiddleware([...allowedOrigins]),
  matchMethodMiddleware(['GET', 'POST'])
);
