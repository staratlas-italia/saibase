import { MongoClient, ServerApiVersion } from 'mongodb';

console.log({ uri: process.env.MONGO_DB_URI });
export const mongoClient = new MongoClient(process.env.MONGO_DB_URI || '', {
  serverApi: ServerApiVersion.v1,
});
