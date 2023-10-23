import { allowedOrigins } from '@saibase/constants';
import { corsMiddleware, matchMethodMiddleware } from '@saibase/middlewares';
import { pipe } from 'fp-ts/function';
import { NextApiRequest, NextApiResponse } from 'next';
import { Fleet, sageGoals, sageScopes } from '../../../../common/types';
import { authenticateMiddleware } from '../../../../middlewares/authenticate';
import { mongo } from '../../../../mongodb';
import { handleErrors } from '../../../../utils/handleErrors';

// TODO: move this di @saibase/sai-database
const collection = mongo.collection<Fleet>('sage-fleets');

const handler = authenticateMiddleware(
  ({ publicKey }) =>
    async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        switch (req.method) {
          case 'GET': {
            const fleets = await collection.find({ publicKey }).toArray();

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
                publicKey,
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
    }
);

export default pipe(
  handler,
  corsMiddleware([...allowedOrigins]),
  matchMethodMiddleware(['GET', 'POST'])
);
