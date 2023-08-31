import { MongoClient, ServerApiVersion } from 'mongodb';

export const mongoClient = new MongoClient(process.env.MONGO_DB_URI || '', {
  serverApi: ServerApiVersion.v1,
});

export const mongo = mongoClient.db('app-db');
