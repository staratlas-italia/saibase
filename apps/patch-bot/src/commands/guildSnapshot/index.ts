import { AppState } from '../../state';

export const guildSnapshot = async (state: AppState) => {
  const guildShipsStatsCollection = state.database.guildShipStats();

  const result = await guildShipsStatsCollection
    .find()
    .sort({ createdAt: -1 })
    .limit(1)
    .toArray();

  return result[0];
};
