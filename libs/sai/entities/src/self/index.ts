import { nullable, optional } from '@saibase/io-ts';
import { factionsCodec, playerCodec } from '@saibase/star-atlas';
import * as t from 'io-ts';

export const selfCodec = t.type({
  createdAt: t.string,
  updatedAt: t.string,
  discordId: nullable(t.string),
  faction: t.union([factionsCodec, t.literal('NONE')]),
  lastRefillAt: optional(t.string),
  notifications: t.boolean,
  players: t.array(playerCodec),,
  tier: optional(t.union([t.literal(0), t.literal(1), t.literal(2)])),
  wallets: t.array(t.string),
  referral: t.type({ code: t.string, createdAt: t.string }),
  fromReferral: optional(t.string),
  tags: optional(t.array(t.literal('cat-lover'))),
});


export type Self = t.TypeOf<typeof selfCodec>;
