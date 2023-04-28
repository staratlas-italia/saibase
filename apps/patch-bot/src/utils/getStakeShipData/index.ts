import { captureException } from '@sentry/node';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAllFleetsForUserPublicKey } from '@staratlas/factory';
import { SA_FLEET_PROGRAM_ID } from '../../constants';

export const getStakeShipData = async (connection: Connection, pbk: string) => {
  try {
    const accounts = await getAllFleetsForUserPublicKey(
      connection,
      new PublicKey(pbk),
      SA_FLEET_PROGRAM_ID
    );

    return accounts;
  } catch (e) {
    captureException(e, { level: 'error' });

    return [];
  }
};
