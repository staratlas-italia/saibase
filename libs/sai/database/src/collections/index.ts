import { Guild, SageShipStats, Self, ShipStats } from '@saibase/sai-entities';
import { mongoClient } from '../client';
import { databaseName } from '../constants';

const db = mongoClient.db(databaseName);

export const saiUsersCollection = db.collection<Self>('users');
export const saiGuildsCollection = db.collection<Guild>('guilds');
export const saiShipsStatsCollection = db.collection<ShipStats>('ships-stats');
export const saiGuildShipsStatsCollection =
  db.collection<ShipStats>('guild-ships-stats');
export const saiSageShipsStatsCollection =
  db.collection<SageShipStats>('sage-ships-stats');
