import { ObjectId } from 'mongodb';
import { AppState } from '../../state';

type Param = {
  id: ObjectId;
  value: boolean;
};

export const updateMemberNotificationFlag = async (
  { id, value }: Param,
  state: AppState
) => {
  const usersCollection = state.database.users();

  const result = await usersCollection.updateOne(
    { _id: id },
    { $set: { notifications: value } }
  );

  return result.modifiedCount === 1;
};
