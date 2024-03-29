import { createError } from '@saibase/errors';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAllFleetsForUserPublicKey } from '@staratlas/factory';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { saScoreProgram } from '../../constants';

type Param = {
  connection: Connection;
  player: PublicKey;
};

export const fetchAllFleets = ({ connection, player }: Param) =>
  pipe(
    TE.tryCatch(
      () => getAllFleetsForUserPublicKey(connection, player, saScoreProgram),
      createError('FetchFleetError')
    )
  );
