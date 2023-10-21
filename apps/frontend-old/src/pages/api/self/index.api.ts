import { pipe } from 'fp-ts/function';
import { NextApiRequest, NextApiResponse } from 'next';
import { match } from 'ts-pattern';
import { matchMethodMiddleware } from '../../../middlewares/matchMethod';
import { useMongoMiddleware } from '../../../middlewares/useMongo';
import { Self } from '../../../types/api';
import { getMongoDatabase } from '../mongodb';

// eslint-disable-next-line react-hooks/rules-of-hooks
const postHandler = useMongoMiddleware(
  async ({ body }: NextApiRequest, res: NextApiResponse) => {
    const { self } = body;

    if (!self) {
      res.status(400).json({
        success: false,
        error: 'Invalid public key',
      });
      return;
    }

    const db = getMongoDatabase();

    const userCollection = db.collection<Self>('users');

    const result = await userCollection.insertOne(self);

    res.json({
      success: true,
      user: {
        _id: result.insertedId.toString(),
        ...self,
      },
    });
  }
);

// eslint-disable-next-line react-hooks/rules-of-hooks
const getHandler = useMongoMiddleware(
  async ({ query }: NextApiRequest, res: NextApiResponse) => {
    const { publicKey } = query;

    if (!publicKey) {
      return res.status(400).json({
        success: false,
        error: 'Invalid public key',
      });
    }

    const db = getMongoDatabase();

    const userCollection = db.collection<Self>('users');

    const user = await userCollection.findOne({
      wallets: publicKey,
    });

    if (!user) {
      return res.status(200).json({
        success: false,
        error: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  }
);

const handler = (req: NextApiRequest, res: NextApiResponse) =>
  match(req.method as 'GET' | 'POST')
    .with('GET', () => getHandler(req, res))
    .with('POST', () => postHandler(req, res))
    .exhaustive();

export default pipe(handler, matchMethodMiddleware(['GET', 'POST']));
