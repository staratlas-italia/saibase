import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { isSignatureLegit } from '@saibase/web3';
import { PublicKey, Transaction } from '@solana/web3.js';
import { pipe } from 'fp-ts/function';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { isSignatureExpired } from '../../utils/isSignatureExpired';

export const authenticateMiddleware =
  (handler: (_: { publicKey: string }) => NextApiHandler) =>
  (req: NextApiRequest, res: NextApiResponse) => {
    const isLedger = req.query.is_ledger === 'true';

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res
        .status(401)
        .json({ status: 401, error: 'Missing authorization header' });
    }

    const [, token] = authHeader.split(' ');

    const [base64Message, publicKey, signature] = token.split('.');

    let isValid = false;

    let isMessageInvalidOrExpired = isSignatureExpired(base64Message);

    if (isLedger) {
      const MEMO_PROGRAM_ID = new PublicKey(
        'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'
      );

      const serializedTx = bs58.decode(signature);

      const signedTx = Transaction.from(serializedTx);

      isValid = (() => {
        try {
          const inx = signedTx.instructions[2];

          if (!inx.programId.equals(MEMO_PROGRAM_ID)) {
            return false;
          }

          if (inx.data.toString() !== base64Message) {
            return false;
          }
          if (!signedTx.verifySignatures()) {
            return false;
          }
        } catch {
          return false;
        }

        return true;
      })();

      isMessageInvalidOrExpired = false;
    } else {
      isValid = pipe(
        new PublicKey(publicKey),
        isSignatureLegit({
          message: base64Message,
          proof: signature,
        })
      );
    }

    if (!isValid || isMessageInvalidOrExpired || !publicKey) {
      return res.status(401).json({ status: 401, error: 'Not authorized.' });
    }

    return handler({ publicKey })(req, res);
  };
