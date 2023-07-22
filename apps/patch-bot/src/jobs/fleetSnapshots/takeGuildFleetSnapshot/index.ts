import { guildWallets } from '../../../constants';
import { AppState } from '../../../state';
import { fetchFleetStatsByOwners } from '../fetchFleetStatsByOwners';

export const createTakeGuildFleetSnapshopshotJobHandler =
  (state: AppState) => async (name: string) => {
    console.time('Ships snapshot taken in');

    const guildShipsStatsCollection = state.database.guildShipStats();

    const shipsStats = await fetchFleetStatsByOwners(state, guildWallets);

    await guildShipsStatsCollection.insertOne(shipsStats);

    console.timeEnd('Ships snapshot taken in');
  };
