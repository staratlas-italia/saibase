import { AppState } from '../../state';

export const getMembersWhoAllowedNotifications = async (
  checkDate: Date,
  state: AppState
) => {
  const usersCollection = state.database.users();

  const users = usersCollection.find({
    $and: [
      { notifications: true },
      {
        $or: [
          { lastRefillAt: { $lte: checkDate } },
          { lastRefillAt: { $exists: false } },
        ],
      },
    ],
  });

  return users.toArray();
};
