import { nullable } from '@saibase/io-ts';
import * as t from 'io-ts';

const balanceCodec = t.type({
  _id: t.string,
  mint: t.string,
  quantity: t.number,
  valuePerAsset: t.number,
});

export const playerCodec = t.type({
  _id: t.string,
  avatarId: t.union([
    t.literal('Ustur_A'),
    t.literal('Ustur_B'),
    t.literal('Ustur_C'),
    t.literal('Ustur_D'),
    t.literal('MUD_A'),
    t.literal('MUD_B'),
    t.literal('MUD_C'),
    t.literal('MUD_D'),
    t.literal('ONI_A'),
    t.literal('ONI_B'),
    t.literal('ONI_C'),
    t.literal('ONI_D'),
    t.literal('ONI_E'),
    t.literal('ONI_F'),
  ]),
  badgeMint: nullable(t.string),
  balance: t.number,
  balances: t.array(balanceCodec),
  country: t.string,
  currencySymbol: t.string,
  faction: t.number,
  factionRank: t.number,
  publicKey: t.string,
  rank: t.number,
  registrationDate: t.string,
  updatedAt: t.string,
});

export const playerResponseCodec = t.union([playerCodec, t.type({})]);

export const factions = ['ONI', 'MUD', 'USTUR'] as const;

export type Faction = (typeof factions)[number];

export type FactionWithNone = Faction | 'NONE';

export type StarAtlasPlayer = t.TypeOf<typeof playerCodec>;
