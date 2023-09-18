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
import { toObjectId } from '../../../../utils/toObjectId';

const collection = mongo.collection<Fleet>('sage-fleets');

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id as string;
  const token = req.cookies.accessToken!;

  const payload = jwt.decode(token) as JwtUserPayload;
  const pbk = payload.publicKey;

  try {
    if (!id) {
      throw new Error('MissingInvalidParam');
    }

    const oid = toObjectId(id);

    switch (req.method) {
      case 'GET': {
        const fleets = await collection
          .find({ _id: oid, publicKey: pbk })
          .toArray();

        if (fleets.length === 0) {
          throw new Error('DocumentNotFound');
        }

        res.status(200).json(fleets[0]);

        break;
      }
      case 'PUT': {
        const { fleet, name, description, scope, goal, lp } = req.body as Fleet;

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

        const updatedFleet = {
          $set: {
            fleet,
            name,
            description,
            scope,
            goal,
            lp,
          },
        };

        const updateFleet = await collection.findOneAndUpdate(
          { _id: oid, publicKey: pbk },
          updatedFleet,
          { returnDocument: 'after' }
        );

        if (!updateFleet.value) {
          throw new Error('DocumentNotFound');
        }

        res.status(200).json(updateFleet.value);
        break;
      }
      case 'DELETE': {
        const deleteFleet = await collection.deleteOne({
          _id: oid,
          publicKey: pbk,
        });

        if (deleteFleet.deletedCount === 0) {
          throw new Error('DocumentNotFound');
        }

        res.status(200).json(deleteFleet);
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
  matchMethodMiddleware(['GET', 'PUT', 'DELETE']),
  authenticateMiddleware
);
