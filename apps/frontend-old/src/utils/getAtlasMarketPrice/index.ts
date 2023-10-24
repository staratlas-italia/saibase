import { get, withDecoder } from '@saibase/fetch';
import { optional } from '@saibase/io-ts';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import qs from 'qs';

const decoder = t.type({
  'star-atlas': optional(t.type({ usd: optional(t.number) })),
});

export const getAtlasMarketPrice = pipe(
  pipe(
    get,
    withDecoder(decoder)
  )(
    `https://api.coingecko.com/api/v3/simple/price?${qs.stringify({
      ids: 'star-atlas',
      vs_currencies: 'usd',
    })}`
  ),
  TE.map((resp) => resp.data['star-atlas']?.usd ?? 0),
  TE.getOrElse(() => T.of(0))
);
