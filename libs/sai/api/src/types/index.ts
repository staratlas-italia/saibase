import { ReactChild, ReactNodeArray, ReactPortal } from 'react';

export type StrictReactFragment =
  | {
      key?: string | number | null;
      ref?: null;
      props?: {
        children?: StrictReactNode;
      };
    }
  | ReactNodeArray;

export type StrictReactNode =
  | ReactChild
  | StrictReactFragment
  | ReactPortal
  | boolean
  | null
  | undefined;

export type Tier = 'tier1' | 'tier2' | 'tier3';

export type Player = {
  avatarId: Avatar;
  avatarImageUrl?: string;
  badgeMint: string | null;
  balance: number;
  balances: {
    mint: string;
    quantity: number;
    valuePerAsset: number;
  }[];
  country: string;
  currencySymbol: Currency;
  faction: number;
  factionRank: number;
  publicKey: string;
  rank: number;
  registrationDate: string;
  updatedAt: string;
};

export type Currency = 'ATLAS' | 'POLIS' | 'USDC' | 'NONE';

export type ShipSlot = {
  type: string;
  size: string;
  quantity: number;
};

export type PromiseContent<PromiseLike> = PromiseLike extends Promise<infer U>
  ? U
  : never;

export const shipSizes = [
  'xx-small',
  'x-small',
  'small',
  'medium',
  'large',
  'capital',
  'commander',
  'titan',
] as const;

export type ShipSize = (typeof shipSizes)[number];

export type Market = {
  _id: string;
  id: string;
  quotePair: string;
  serumProgramId: string;
};

export type UsturAvatar = 'Ustur_A' | 'Ustur_B' | 'Ustur_C' | 'Ustur_D';
export type MudAvatar = 'MUD_A' | 'MUD_B' | 'MUD_C' | 'MUD_D';
export type OniAvatar =
  | 'ONI_A'
  | 'ONI_B'
  | 'ONI_C'
  | 'ONI_D'
  | 'ONI_E'
  | 'ONI_F';

export type Avatar = UsturAvatar | MudAvatar | OniAvatar;

export type BestPrices = {
  avgPrice: number;
  bestAskPrice: number;
  bestBidPrice: number;
};

export const factions = ['ONI', 'MUD', 'USTUR'] as const;

export type Faction = (typeof factions)[number];

export type FactionWithNone = Faction | 'NONE';