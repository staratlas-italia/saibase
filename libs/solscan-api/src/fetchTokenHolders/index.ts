import { get, withDecoder, withHeaders } from '@saibase/fetch';
import { PublicKey } from '@solana/web3.js';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { buildRoute } from '../routes';
import { holderResponseCodec } from './decoder';

const fetcher = (apiToken: string) => (url: string) =>
  pipe(
    get,
    withDecoder(holderResponseCodec),
    withHeaders({
      'Content-Type': 'application/json',
      token: apiToken,
    })
  )(url);

type Param = {
  apiToken: string;
  mint: PublicKey;
  page: number;
  limit?: number;
};

export const fetchTokenHolders = ({
  apiToken,
  mint,
  limit = 20,
  page = 0,
}: Param) =>
  pipe(
    buildRoute('/token/holders', {
      limit: limit,
      offset: limit * page,
      tokenAddress: mint.toString(),
    }),
    fetcher(apiToken)
  );

export const fetchAllTokenHolders = ({
  apiToken,
  mint,
  limit = 20,
}: Omit<Param, 'page'>) =>
  pipe(
    fetchTokenHolders({ apiToken, mint, limit, page: 0 }),
    TE.chain((res) =>
      pipe(
        Math.ceil(res.data.total / limit) - 1,
        (pageNumber) => RA.makeBy(pageNumber, (i) => i + 1),
        TE.traverseSeqArray((page) =>
          pipe(
            fetchTokenHolders({ apiToken, mint, limit, page }),
            TE.map((resp) => resp.data.data)
          )
        ),
        TE.map(RA.flatten)
      )
    )
  );
