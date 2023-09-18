import { pipe } from 'fp-ts/lib/function';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  Fleet,
  JwtUserPayload,
  sageGoals,
  sageScopes,
} from '../../../../common/types';
import { authenticateMiddleware } from '../../../../middlewares/authenticate';
import { matchMethodMiddleware } from '../../../../middlewares/matchMethod';
import { mongo } from '../../../../mongodb';
import { handleErrors } from '../../../../utils/handleErrors';

const collection = mongo.collection<Fleet>('sage-fleets');

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.cookies.accessToken!;

  const payload = jwt.decode(token) as JwtUserPayload;
  const pbk = payload.publicKey;

  try {
    switch (req.method) {
      case 'GET': {
        const fleets = await collection.find({ publicKey: pbk }).toArray();
        res.status(200).json(fleets);
        break;
      }
      case 'POST':
        {
          const { fleet, name, description, scope, goal, lp } =
            req.body as Fleet;

          if (
            !fleet ||
            !name ||
            !scope ||
            !goal ||
            !lp ||
            typeof lp !== 'number' ||
            !sageScopes.has(scope) ||
            !sageGoals.has(goal)
          ) {
            throw new Error('MissingInvalidParam');
          }

          const newFleet = await collection.insertOne({
            publicKey: pbk,
            fleet,
            name,
            description,
            scope,
            goal,
            lp,
            deks: [],
          });

          res.status(200).json(newFleet);
        }
        break;
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
  matchMethodMiddleware(['GET', 'POST']),
  authenticateMiddleware
);
