import {
  Err,
  get,
  Resp,
  withDecoder,
  withHeaders,
} from '@saibase/fetch';
import { PublicKey } from '@solana/web3.js';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { apiResourcesUrl } from '../constants';
import { playerResponseCodec, StarAtlasPlayer } from '../entities/player';

const fetcher = (publicKey: PublicKey) =>
  pipe(
    get,
    withDecoder(playerResponseCodec),
    withHeaders({ 'Content-Type': 'application/json' })
  )(`${apiResourcesUrl}/players/${publicKey.toString()}`);

export const fetchPlayer = (
  publicKey: PublicKey
): TE.TaskEither<Err, Resp<StarAtlasPlayer | null>> =>
  pipe(
    fetcher(publicKey),
    TE.map(({ response, data }) =>
      Object.keys(data).length === 0
        ? { response, data: null }
        : { response, data: data as StarAtlasPlayer }
    )
  );
