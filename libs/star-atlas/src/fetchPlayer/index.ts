import { createError } from '@saibase/errors';
import { get, withDecoder, withHeaders } from '@saibase/fetch';
import { PublicKey } from '@solana/web3.js';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { saApiResourcesUrl } from '../constants';
import { StarAtlasPlayer, playerResponseCodec } from '../entities/player';

const fetcher = (publicKey: PublicKey) =>
  pipe(
    get,
    withDecoder(playerResponseCodec),
    withHeaders({ 'Content-Type': 'application/json' })
  )(`${saApiResourcesUrl}/players/${publicKey.toString()}`);

export const fetchPlayer = (publicKey: PublicKey) =>
  pipe(
    fetcher(publicKey),
    TE.chainW(({ response, data }) =>
      Object.keys(data).length === 0
        ? TE.left(
            createError('PlayerNotFound')(
              `Cannot find player with publicKey ${publicKey.toString()}`
            )
          )
        : TE.right({ response, data: data as StarAtlasPlayer })
    )
    // TE.mapLeft(({ type, error }) => createError(type)(error))
  );
