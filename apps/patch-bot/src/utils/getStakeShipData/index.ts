import { saScoreProgram } from '@saibase/star-atlas';
import { captureException } from '@sentry/node';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAllFleetsForUserPublicKey } from '@staratlas/factory';

export const getStakeShipData = async (connection: Connection, pbk: string) => {
  try {
    const accounts = await getAllFleetsForUserPublicKey(
      connection,
      new PublicKey(pbk),
      saScoreProgram
    );

    return accounts;
  } catch (e) {
    captureException(e, { level: 'error' });

    return [];
  }
};
