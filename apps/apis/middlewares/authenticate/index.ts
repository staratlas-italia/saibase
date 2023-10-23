import { isSignatureLegit } from '@saibase/web3';
import { PublicKey } from '@solana/web3.js';
import { pipe } from 'fp-ts/function';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { isSignatureExpired } from '../../utils/isSignatureExpired';

export const authenticateMiddleware =
  (handler: (_: { publicKey: string }) => NextApiHandler) =>
  (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res
        .status(401)
        .json({ status: 401, error: 'Missing authorization header' });
    }

    const [, token] = authHeader.split(' ');

    const [base64Message, publicKey, signature] = token.split('.');

    const isValid = pipe(
      new PublicKey(publicKey),
      isSignatureLegit({
        message: base64Message,
        proof: signature,
      })
    );

    const isMessageInvalidOrExpired = isSignatureExpired(base64Message);

    if (!isValid || isMessageInvalidOrExpired || !publicKey) {
      return res.status(401).json({ status: 401, error: 'Not authorized.' });
    }

    return handler({ publicKey })(req, res);
  };
