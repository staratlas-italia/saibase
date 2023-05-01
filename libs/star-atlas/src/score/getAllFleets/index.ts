import { createError } from '@saibase/errors';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAllFleetsForUserPublicKey } from '@staratlas/factory';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { saFleetProgram } from '../../constants';

type Param = {
  connection: Connection;
  player: PublicKey;
};

export const getAllFleets = ({ connection, player }: Param) =>
  pipe(
    TE.tryCatch(
      () => getAllFleetsForUserPublicKey(connection, player, saFleetProgram),
      createError('FetchFleetError')
    )
  );
