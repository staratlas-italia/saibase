import { StarAtlasNft } from '@saibase/star-atlas';
import { BN } from '@project-serum/anchor';
import type { ShipStakingInfo } from '@staratlas/factory';
import { ObjectId, WithId } from 'mongodb';

export type Resource = 'food' | 'tools' | 'ammo' | 'fuel';

export type Command = 'push' | 'referral' | 'version';

export type PushCommandStatus = 'on' | 'off';

// REFILL JOB
export type NormalizedShipStakingInfo = {
  [key in keyof ShipStakingInfo]: ShipStakingInfo[key] extends infer U
    ? U extends BN
      ? number
      : string
    : never;
};

export type NormalizedShipStakingInfoExtended = NormalizedShipStakingInfo & {
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

export type ShipSlot = {
  type: string;
  size: string;
  quantity: number;
};

export type Market = {
  _id: string;
  id: string;
  quotePair: string;
  serumProgramId: string;
};

export type ShipStats = {
  createdAt: Date;
  ships: Record<
    string,
    { stakedQuantity: number; inWalletQuantity: number; vwap?: number } & Pick<
      StarAtlasNft,
      'attributes' | 'mint' | 'name'
    >
  >;
};

export type TransactionStatus =
  | 'ACCEPTED'
  | 'ACCEPTED_WITHOUT_RETURN'
  | 'PENDING'
  | 'REJECTED';

export type CitizenshipTransaction = Transaction<{
  faction: Faction;
  publicKey: string;
  amount: number;
  name: 'CITIZENSHIP_CARD';
}>;

export type Transaction<Meta = Record<string, string | number>> = {
  attempt?: number;
  createdAt: Date;
  meta: Meta;
  userId: ObjectId;
  reference: string;
  status: TransactionStatus;
};

export const factions = ['ONI', 'MUD', 'USTUR'] as const;

export type Faction = (typeof factions)[number];

export type FactionWithNone = Faction | 'NONE';

export type Guild = {
  serverId: string;
  serverName: string;
  ownerId: string;
  options?: {
    rolesJobDisabled?: boolean;
    announcementsChannelId?: string;
  };
};

export type Self = WithId<{
  createdAt?: Date;
  updatedAt?: Date;
  discordId: string | null;
  faction?: FactionWithNone;
  lastRefillAt?: Date;
  notifications: boolean;
  players: ({
    country: string | null;
    faction: FactionWithNone;
    publicKey: string;
    registrationDate: Date;
  } | null)[];
  tier?: 0 | 1 | 2;
  wallets: string[];
  referral?: { code: string; createdAt: Date };
  fromReferral?: string;
}>;

export type UserToken = {
  amount: number;
  createdAt: Date;
  userId: ObjectId;
  currency: string;
  payerId?: ObjectId;
};

export type Environment = 'development' | 'production';
