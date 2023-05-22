import { ObjectId } from 'mongodb';
import { AppState } from '../../../../state';

export const getTokenBalance = async (discordId: string, state: AppState) => {
  const usersCollection = state.database.users();
  const userTokensCollection = state.database.userTokens();

  const user = await usersCollection.findOne({
    discordId,
  });

  if (!user) {
    return { error: 'user_not_found', balance: 0 };
  }

  const balanceAgg = await userTokensCollection.aggregate<{
    _id: ObjectId;
    balance: number;
  }>([
    {
      $group: {
        _id: '$userId',
        balance: {
          $sum: '$amount',
        },
      },
    },
    {
      $match: {
        _id: user._id,
      },
    },
  ]);

  const result = await balanceAgg.toArray();

  return { balance: result?.[0]?.balance ?? 0 };
};
