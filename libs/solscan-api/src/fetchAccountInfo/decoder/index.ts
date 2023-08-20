import { optional } from '@saibase/io-ts';
import * as t from 'io-ts';

export const accountCodec = t.type({
  account: t.string,
  lamports: optional(t.number),
  ownerProgram: optional(t.string),
  type: optional(t.string),
  rentEpoch: optional(t.number),
});

export type Account = t.TypeOf<typeof accountCodec>;
