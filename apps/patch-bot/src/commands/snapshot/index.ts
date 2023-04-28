import { AppState } from '../../state';

export const snapshot = async (state: AppState) => {
  const shipsStatsCollection = state.database.shipStats();

  const result = await shipsStatsCollection
    .find()
    .sort({ createdAt: -1 })
    .limit(1)
    .toArray();

  return result[0];
};
