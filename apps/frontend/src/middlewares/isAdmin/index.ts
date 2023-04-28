import { parsePublicKey } from '@saibase/web3';
import * as E from 'fp-ts/Either';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { isAdminPublicKey } from '~/utils/isAdminPublicKey';

export type IsAdminMiddlewareRequestBody = {
  publicKey: string;
};

export type IsAdminMiddlewareReponse =
  | {
      status: 403;
      error: string;
    }
  | {
      status: 400;
      error: string;
    };

export const isAdminMiddleware =
  (handler: NextApiHandler) => (req: NextApiRequest, res: NextApiResponse) => {
    const { publicKey } = req.body;

    const realPublicKeyEither = parsePublicKey(publicKey);

    if (!publicKey || E.isLeft(realPublicKeyEither)) {
      return res
        .status(400)
        .json({ status: 400, error: 'Missing or invalid parameters' });
    }

    if (!isAdminPublicKey(realPublicKeyEither.right)) {
      return res.status(403).json({ status: 403, error: 'Not allowed' });
    }

    return handler(req, res);
  };
