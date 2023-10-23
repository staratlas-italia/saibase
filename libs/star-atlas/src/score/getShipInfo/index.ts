import { createError } from '@saibase/errors';
import { Connection, PublicKey } from '@solana/web3.js';
import { getScoreVarsShipInfo } from '@staratlas/factory';
import * as TE from 'fp-ts/TaskEither';
import { saScoreProgram } from '../../constants';

type Param = {
  connection: Connection;
  shipMint: PublicKey;
};

export const getShipInfo = ({ connection, shipMint }: Param) =>
  TE.tryCatch(
    () => getScoreVarsShipInfo(connection, saScoreProgram, shipMint),
    createError('FetchShipVarsError')
  );
