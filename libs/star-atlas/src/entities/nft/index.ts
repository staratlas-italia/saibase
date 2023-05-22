import { BN } from '@project-serum/anchor';
import {
  ScoreVarsShipInfo as SaScoreVarsShipInfo,
  ShipStakingInfo as SaShipStakingInfo,
} from '@staratlas/factory';
import * as t from 'io-ts';
import { nullable, optional } from '../../utils';

export const classCodec = t.union([
  t.literal('badge'),
  t.literal('capital'),
  t.literal('Capital'),
  t.literal('charm'),
  t.literal('commander'),
  t.literal('Commander'),
  t.literal('consumable'),
  t.literal('currency'),
  t.literal('crew gear'),
  t.literal('crew'),
  t.literal('emote'),
  t.literal('graphic-novel'),
  t.literal('hab assets'),
  t.literal('housing'),
  t.literal('human'),
  t.literal('large'),
  t.literal('Large'),
  t.literal('license'),
  t.literal('material bundle'),
  t.literal('medium'),
  t.literal('Medium'),
  t.literal('mini'),
  t.literal('mining equipment'),
  t.literal('pet'),
  t.literal('poster'),
  t.literal('skin'),
  t.literal('small'),
  t.literal('Small'),
  t.literal('space station structure'),
  t.literal('stake'),
  t.literal('titan'),
  t.literal('trinket'),
  t.literal('x-small'),
  t.literal('xx-small'),
  t.literal('XX-Small'),
  t.literal('xxx-small'),
]);

export const attributeCodec = t.type({
  itemType: t.union([
    t.literal('collectible'),
    t.literal('access'),
    t.literal('ship'),
    t.literal('structure'),
    t.literal('resource'),
    t.literal('story'),
    t.literal('currency'),
  ]),
  tier: optional(t.number),
  class: classCodec,
  category: optional(t.string),
  score: optional(t.number),
  rarity: t.union([
    t.literal('epic'),
    t.literal('uncommon'),
    t.literal('legendary'),
    t.literal('anomaly'),
    t.literal('rare'),
    t.literal('common'),
  ]),
  musician: optional(t.string),
  spec: optional(t.string),
  make: optional(t.string),
  model: optional(t.string),
  unitLength: optional(t.number),
  unitWidth: optional(t.number),
  unitHeight: optional(t.number),
  seriesName: optional(t.literal('core')),
  episode: optional(t.number),
  edition: optional(
    t.union([t.literal('star-atlas'), t.literal('magic-eden')])
  ),
});

const slotCodec = t.type({
  type: t.string,
  size: t.string,
  quantity: t.number,
});

const slotsCodec = t.type({
  crewSlots: nullable(t.array(slotCodec)),
  componentSlots: nullable(t.array(slotCodec)),
  moduleSlots: nullable(t.array(slotCodec)),
});

const airdropCodec = t.type({
  _id: t.string,
  supply: t.number,
  id: t.number,
});

const collectionCodec = t.type({
  name: t.string,
  family: t.string,
});

const marketCodec = t.type({
  _id: optional(t.string),
  id: t.string,
  quotePair: t.string,
  serumProgramId: optional(t.string),
});

const mediaCodec = t.type({
  qrInstagram: optional(t.string),
  qrFacebook: optional(t.string),
  sketchfab: optional(t.string),
  audio: optional(t.string),
  thumbnailUrl: t.string,
  gallery: optional(nullable(t.array(t.string))),
});

const msrpCodec = t.type({
  value: t.number,
  currencySymbol: t.string,
});

const primarySaleCodec = t.type({
  listTimestamp: t.number,
  id: nullable(t.string),
  _id: optional(t.string),
  supply: optional(t.number),
  price: optional(t.number),
  isMinted: optional(t.boolean),
  isListed: optional(t.boolean),
  mintTimestamp: optional(nullable(t.number)),
  orderId: optional(nullable(t.string)),
  expireTimestamp: optional(t.number),
  targetPair: optional(t.string),
  quotePrice: optional(t.number),
});

const tradeSettingsCodec = t.type({
  expireTime: optional(t.union([t.string, t.number])),
  saleTime: optional(t.union([t.string, t.number])),
  vwap: optional(t.number),
  msrp: optional(msrpCodec),
  saleType: optional(t.string),
  limited: optional(t.string),
});

export const nftCodec = t.type({
  _id: t.string,
  deactivated: t.boolean,
  name: t.string,
  description: t.string,
  image: t.string,
  media: mediaCodec,
  attributes: attributeCodec,
  symbol: t.string,
  markets: t.array(marketCodec),
  totalSupply: optional(t.number),
  mint: t.string,
  network: optional(t.string),
  tradeSettings: tradeSettingsCodec,
  airdrops: t.array(airdropCodec),
  primarySales: t.array(primarySaleCodec),
  updatedAt: t.string,
  collection: optional(collectionCodec),
  slots: optional(slotsCodec),
  id: t.string,
  createdAt: optional(t.string),
  __v: optional(t.number),
});

export const nftsCodec = t.array(nftCodec);

export type NftClass = t.TypeOf<typeof classCodec>;
export type NftPrimarySale = t.TypeOf<typeof primarySaleCodec>;
export type StarAtlasNft = t.TypeOf<typeof nftCodec>;
export type StarAtlasNftArray = t.TypeOf<typeof nftsCodec>;

export type ShipStakingInfo = {
  [key in keyof SaShipStakingInfo]: SaShipStakingInfo[key] extends infer U
    ? U extends BN
      ? number
      : string
    : never;
};

export type ShipStakingInfoExtended = ShipStakingInfo & {
  pendingRewardsV2: number;
  rewardRatePerSecond: number;
  fuelMaxReserve: number;
  foodMaxReserve: number;
  armsMaxReserve: number;
  toolkitMaxReserve: number;
  millisecondsToBurnOneFuel: number;
  millisecondsToBurnOneFood: number;
  millisecondsToBurnOneArms: number;
  millisecondsToBurnOneToolkit: number;
  dailyFuelConsumption: number;
  dailyFoodConsumption: number;
  dailyArmsConsumption: number;
  dailyToolkitConsumption: number;
  dailyFuelCostInAtlas: number;
  dailyFoodCostInAtlas: number;
  dailyArmsCostInAtlas: number;
  dailyToolkitCostInAtlas: number;
  dailyMaintenanceCostInAtlas: number;
  grossDailyRewardInAtlas: number;
  netDailyRewardInAtlas: number;
};

export type ScoreVarsShipInfo = {
  [key in keyof SaScoreVarsShipInfo]: SaScoreVarsShipInfo[key] extends infer U
    ? U extends BN
      ? number
      : U extends number
      ? number
      : string
    : never;
};
