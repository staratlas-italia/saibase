import { StarAtlasNft } from '@saibase/star-atlas';
import { ObjectId, WithId } from 'mongodb';

export type Resource = 'food' | 'tools' | 'ammo' | 'fuel';

export type Command = 'push' | 'referral' | 'version';

export type PushCommandStatus = 'on' | 'off';

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
