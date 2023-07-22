import { Db, MongoClient } from 'mongodb';
import {
  CitizenshipTransaction,
  Guild,
  Self,
  ShipStats,
  UserToken,
} from '../../types';

export class DbClient {
  mongo: Db;

  constructor(client: MongoClient) {
    this.mongo = client.db('app-db');
  }

  guilds() {
    return this.mongo.collection<Guild>('guilds');
  }

  users() {
    return this.mongo.collection<Self>('users');
  }

  shipStats() {
    return this.mongo.collection<ShipStats>('ships-stats');
  }

  guildShipStats() {
    return this.mongo.collection<ShipStats>('guild-ships-stats');
  }

  userTokens() {
    return this.mongo.collection<UserToken>('user-tokens');
  }

  transactions() {
    return this.mongo.collection<CitizenshipTransaction>('transactions');
  }
}
