import { createError } from '@saibase/errors';
import { Connection, PublicKey } from '@solana/web3.js';
import { createInitialDepositInstruction } from '@staratlas/factory';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { saFleetProgram } from '../../constants';

type Param = {
  connection: Connection;
  player: PublicKey;
  shipQuantity?: number;
  shipMint: PublicKey;
  shipTokenAccount: PublicKey;
};

export const getInitialDepositInstruction = ({
  connection,
  player,
  shipQuantity = 1,
  shipMint,
  shipTokenAccount,
}: Param) =>
  pipe(
    TE.tryCatch(
      () =>
        createInitialDepositInstruction(
          connection,
          player,
          shipQuantity,
          shipMint,
          shipTokenAccount,
          saFleetProgram
        ),
      createError('CreateInitialDepositInstructionError')
    )
  );
