import * as t from 'io-ts';

export const holderCodec = t.type({
  address: t.string,
  amount: t.number,
  decimals: t.number,
  owner: t.string,
  rank: t.number,
});

export const holderResponseCodec = t.type({
  data: t.array(holderCodec),
  total: t.Integer,
});

export type Holder = t.TypeOf<typeof holderCodec>;

export type HolderResponse = t.TypeOf<typeof holderResponseCodec>;
