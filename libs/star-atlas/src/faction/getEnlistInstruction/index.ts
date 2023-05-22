import { createError } from '@saibase/errors';
import { Connection, PublicKey } from '@solana/web3.js';
import { FactionType, enlistToFaction } from '@staratlas/factory';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { saFactionProgram } from '../../constants';

type Param = {
  connection: Connection;
  player: PublicKey;
  factionId: FactionType;
};

export const getEnlistInstruction = ({
  connection,
  factionId,
  player,
}: Param) =>
  pipe(
    TE.tryCatch(
      () => enlistToFaction(connection, factionId, player, saFactionProgram),
      createError('CreateEnlistInstructionError')
    )
  );
