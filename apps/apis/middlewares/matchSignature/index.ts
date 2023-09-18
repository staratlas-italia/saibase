import { parsePublicKey } from '@saibase/web3';
import { captureException } from '@sentry/nextjs';
import crypto from 'crypto';
import * as E from 'fp-ts/Either';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { SignInMessage, User } from '../../common/types';
import { mongo } from '../../mongodb';
import { isSignatureValid } from '../../utils/isSignatureValid';

const collection = mongo.collection<User>('sage-users');

export const matchSignatureMiddleware =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { publicKey, message, signature } = req.body;

    // la pbk è valida?
    const realPublicKeyEither = parsePublicKey(publicKey);

    // mancano dei parametri?
    if (!publicKey || E.isLeft(realPublicKeyEither) || !message || !signature) {
      return res
        .status(400)
        .json({ status: 400, error: 'Missing or invalid parameters' });
    }

    // la firma è scaduta?
    const parsedMessage: SignInMessage = JSON.parse(message);
    if (Date.now() / 1000 - parsedMessage.timestamp > 3000) {
      return res
        .status(400)
        .json({ status: 400, error: 'This signature is expired' });
    }

    // l'utente esiste?
    try {
      const users = await collection.find({ publicKey }).toArray();

      if (users.length === 0) {
        res.status(400).json({ status: 400, error: 'The user is not exists' });
        return;
      }

      const user = users[0];

      // la firma è verificata?
      const serverMessage = `{ "message": "I'm logging to SAI Hub with this temp nonce: ${user.currentNonce}", "timestamp": ${parsedMessage.timestamp} }`;

      const isValid = isSignatureValid({
        message: serverMessage,
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

      // tutto regolare, aggiorna il nonce dell'utente nel db
      const updateNonce = {
        $set: {
          ...user,
          currentNonce: crypto.randomBytes(32).toString('hex'),
        },
      };

      await collection.updateOne(user, updateNonce);
    } catch (err) {
      res.status(500).json({ status: 500, error: 'Internal server error' });
    }

    // tutto regolare, avanti
    return handler(req, res);
  };

/*   export const matchSignatureMiddleware =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const publicKey = req.query.publicKey as string;
    const message = req.query.message as string;
    const signature = req.query.signature as string;

    const realPublicKeyEither = parsePublicKey(publicKey);
    if (!publicKey || E.isLeft(realPublicKeyEither) || !message || !signature) {
      return res
        .status(400)
        .json({ status: 400, error: 'Missing or invalid parameters' });
    }

    if (
      typeof publicKey !== 'string' ||
      typeof message !== 'string' ||
      typeof signature !== 'string'
    ) {
      return res
        .status(400)
        .json({ status: 400, error: 'Parameters should be of type string' });
    }

    const messageJson: SignInMessage = JSON.parse(message);

    if (Date.now() / 1000 - messageJson.timestamp > 300) {
      return res.status(400).json({ status: 400, error: 'Invalid signature' });
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
  }; */
