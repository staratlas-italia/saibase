import { ObjectId } from 'mongodb';

export const toObjectId = (id: string): ObjectId => {
  try {
    return new ObjectId(id);
  } catch (err) {
    throw new Error('InvalidObjectId');
  }
};
