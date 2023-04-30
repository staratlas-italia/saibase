import { Err, get, Resp, withDecoder, withHeaders } from '@saibase/fetch';
import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/lib/TaskEither';
import { saApiResourcesUrl } from '../constants';
import { nftsCodec, StarAtlasNftArray } from '../entities/nft';

export const fetchNfts = (): TaskEither<Err, Resp<StarAtlasNftArray>> =>
  pipe(
    get,
    withDecoder(nftsCodec),
    withHeaders({ 'Content-Type': 'application/json' })
  )(`${saApiResourcesUrl}/nfts`);
