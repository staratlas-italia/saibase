import { matchSignatureMiddleware } from '@saibase/middlewares';
import { pipe } from 'fp-ts/function';
import md5 from 'md5';
import { NextApiRequest, NextApiResponse } from 'next';
import { matchMethodMiddleware } from '../../../../middlewares/matchMethod';
import { Self } from '../../../../types/api';
import { getMongoDatabase, mongoClient } from '../../mongodb';

const handler = matchSignatureMiddleware(
  ({ publicKey }) =>
    async (_: NextApiRequest, res: NextApiResponse) => {
      try {
        await mongoClient.connect();
      } catch (e) {
        console.log('Cannot connect to mongo...', JSON.stringify(e));
        res.status(500).json({
          error: 'Cannot connect to DB.',
        });
      }

      const db = getMongoDatabase();

      const userCollection = db.collection<Self>('users');

      const user = await userCollection.findOne({
        wallets: { $in: [publicKey] },
      });

      if (!user) {
        res.status(200).json({
          success: false,
          error: 'User not found.',
        });
        return;
      }

      if (user.referral) {
        res.status(200).json({
          success: false,
          error: 'Already had a referral code',
        });
        return;
      }

      const referralCode = md5(user._id.toString()).toString().toUpperCase();

      await userCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            referral: {
              code: referralCode,
              createdAt: new Date(),
            },
          },
        }
      );

      res.status(200).json({
        success: true,
        code: referralCode,
      });
    }
);

export default pipe(handler, matchMethodMiddleware(['POST']));
