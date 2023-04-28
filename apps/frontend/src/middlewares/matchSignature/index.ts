import { parsePublicKey } from '@saibase/web3';
import { captureException } from '@sentry/nextjs';
import * as E from 'fp-ts/Either';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { isSignatureValid } from '~/utils/isSignatureValid';

export type MatchSignatureMiddlewareRequestBody = {
  publicKey: string;
  signature: string;
};

export type MatchSignatureMiddlewareReponse =
  | {
      status: 403;
      error: string;
    }
  | {
      status: 400;
      error: string;
    };

export const matchSignatureMiddleware =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { message, publicKey, signature } = req.body;

    const realPublicKeyEither = parsePublicKey(publicKey);

    if (!publicKey || E.isLeft(realPublicKeyEither) || !message || !signature) {
      return res
        .status(400)
        .json({ status: 400, error: 'Missing or invalid parameters' });
    }

    const isValid = isSignatureValid({
      message,
      proof: signature,
      signer: realPublicKeyEither.right,
    });

    try {
      if (!isValid) {
        res.status(403).json({
          status: 403,
          error: 'Signature does not match',
        });
        return;
      }
    } catch (e) {
      captureException(e);

      res.status(403).json({ status: 403, error: 'Cannot verify signature' });
      return;
    }

    return handler(req, res);
  };
