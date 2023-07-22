import { getNftOwner } from '@saibase/web3';
import { PublicKey } from '@solana/web3.js';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { connection, guildWallets } from '../../../constants';
import { badgeMints } from '../../../constants/badgeMints';
import { logger } from '../../../logger';
import { AppState } from '../../../state';
import { fetchFleetStatsByOwners } from '../fetchFleetStatsByOwners';

export const createTakeFleetSnapshopshotJobHandler =
  (state: AppState) => async (name: string) => {
    console.time('Ships snapshot taken in');

    const owners = new Set<string>();

    for (const [index, mint] of badgeMints.entries()) {
      logger.info(`Getting ${mint} owner. ${index + 1} / ${badgeMints.length}`);

      const currentOwner = await pipe(
        getNftOwner({ connection, mint: new PublicKey(mint) }),
        TE.fold(
          () => T.of(null),
          (owner) => T.of(owner?.toString() ?? null)
        )
      )();

      if (currentOwner) {
        owners.add(currentOwner);
      }
    }

    const allOwners = [...owners].concat(guildWallets);

    const shipsStats = await fetchFleetStatsByOwners(state, allOwners);

    const shipsStatsCollection = state.database.shipStats();

    await shipsStatsCollection.insertOne(shipsStats);

    console.timeEnd('Ships snapshot taken in');
  };
