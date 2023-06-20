import { createLogger } from '@saibase/logger';
import { Client, GatewayIntentBits } from 'discord.js';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { DbClient } from './DbClient';

const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const mongoClient = new MongoClient(process.env.MONGO_DB_URI || '', {
  serverApi: ServerApiVersion.v1,
});

const database = new DbClient(mongoClient);

const logger = createLogger('patch-bot');

export const state = {
  database,
  discord,
  logger,
};

export type AppState = typeof state;
