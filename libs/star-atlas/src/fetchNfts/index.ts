import { Err, get, Resp, withDecoder, withHeaders } from '@saibase/fetch';
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { saApiResourcesUrl } from '../constants';
import { nftsCodec, StarAtlasNftArray } from '../entities/nft';

export const fetchNfts = (): TE.TaskEither<Err, Resp<StarAtlasNftArray>> =>
  pipe(
    get,
    withDecoder(nftsCodec),
    withHeaders({ 'Content-Type': 'application/json' })
  )(`${saApiResourcesUrl}/nfts`);

type Param = {
  category: string;
};

export const fetchNftsByCategory = ({ category }: Param) =>
  pipe(
    fetchNfts(),
    TE.map(({ data }) =>
      pipe(
        data,
        A.filter((nft) => nft.attributes.category === category)
      )
    )
  );
