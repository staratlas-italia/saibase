import { isSignatureLegit, parsePublicKey } from '@saibase/web3';
import { captureException } from '@sentry/nextjs';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export type MatchSignatureMiddlewareRequestBody = {
  publicKey: string;
  signature: string;
  message: string;
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
  (handler: (params: MatchSignatureMiddlewareRequestBody) => NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { message, publicKey, signature } = req.body;

    if (!publicKey || !message || !signature) {
      return res
        .status(400)
        .json({ status: 400, error: 'Missing or invalid parameters' });
    }

    const isValid = pipe(
      parsePublicKey(publicKey),
      E.map(
        isSignatureLegit({
          message,
          proof: signature,
        })
      ),
      E.getOrElse(() => false)
    );

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

    return handler({ message, publicKey, signature })(req, res);
  };
