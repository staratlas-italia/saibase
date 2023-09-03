import { isPublicKey } from '@saibase/web3';
import { captureException } from '@sentry/nextjs';
import {
  findReference,
  FindReferenceError,
  ValidateTransferError,
} from '@solana/pay';
import { Cluster, Connection, PublicKey } from '@solana/web3.js';
import { pipe } from 'fp-ts/function';
import { NextApiRequest, NextApiResponse } from 'next';
import { matchMethodMiddleware } from '../../../../../../apps/frontend/src/middlewares/matchMethod';
import { useMongoMiddleware } from '~/middlewares/useMongo';
import { getMongoDatabase } from '~/pages/api/mongodb';
import { Transaction } from '~/types/api';
import { getConnectionClusterUrl } from '~/utils/connection';

const handler = async ({ body }: NextApiRequest, res: NextApiResponse) => {
  const { cluster: clusterParam, reference: referenceParam, publicKey } = body;

  if (!referenceParam || !isPublicKey(publicKey)) {
    res.status(400).json({
      success: false,
      error: 'Invalid parameters supplied.',
    });
    return;
  }

  const cluster = clusterParam as Cluster;

  const db = getMongoDatabase(cluster);

  const reference = new PublicKey(referenceParam);
  const connection = new Connection(getConnectionClusterUrl(cluster));

  try {
    const signatureInfo = await findReference(connection, reference, {
      finality: 'confirmed',
    });

    const status = await connection.getSignatureStatus(
      signatureInfo.signature,
      {
        searchTransactionHistory: true,
      }
    );

    if (status.value?.err) {
      throw new ValidateTransferError('Transaction failed');
    }

    if (status.value?.confirmationStatus === 'processed') {
      throw new FindReferenceError('Not finalized yet');
    }
  } catch (e) {
    if (e instanceof FindReferenceError) {
      res.status(200).json({
        success: true,
        verified: false,
      });

      return;
    }

    if (e instanceof ValidateTransferError) {
      captureException(e, { level: 'error' });

      res.status(200).json({
        success: false,
        error: 'Invalid transaction',
      });
      return;
    }

    captureException(e, { level: 'error' });

    console.log(JSON.stringify(e));

    res.status(200).json({
      success: false,
      error: 'Generic error',
    });

    return;
  }

  const transactionsCollection = db.collection<Transaction>('transactions');

  await transactionsCollection.findOneAndUpdate(
    {
      reference: referenceParam,
      status: 'PENDING',
    },
    {
      $set: {
        status: 'ACCEPTED',
      },
    }
  );

  res.status(200).json({
    success: true,
    verified: true,
  });
};

export default pipe(
  handler,
  matchMethodMiddleware(['POST']),
  useMongoMiddleware
);
