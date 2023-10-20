import { NextApiRequest, NextApiResponse } from 'next';
import { match } from 'ts-pattern';
import { getMongoDatabase } from "../mongodb";
import { Self } from "../../../types/api";

const postHandler = async ({ body }: NextApiRequest, res: NextApiResponse) => {
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
};

const getHandler = async ({ query }: NextApiRequest, res: NextApiResponse) => {
  const { publicKey } = query;

  if (!publicKey) {
    res.status(400).json({
      success: false,
      error: 'Invalid public key',
    });
    return;
  }

  const db = getMongoDatabase();

  const userCollection = db.collection<Self>('users');

  const user = await userCollection.findOne({
    wallets: publicKey,
  });

  if (!user) {
    res.status(200).json({
      success: false,
      error: 'User not found.',
    });
    return;
  }

  res.status(200).json({
    success: true,
    user,
  });
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  match(req.method)
    .with('GET', () => getHandler(req, res))
    .with('POST', () => postHandler(req, res))
    .otherwise(() =>
      res.status(405).json({ success: false, error: 'Method not allowed' })
    );
};

export default handler;
