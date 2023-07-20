import { fetchNfts, getEntityVwapPrice } from '@saibase/star-atlas';
import { getNftOwner, getTokenBalanceByMint } from '@saibase/web3';
import { PublicKey } from '@solana/web3.js';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { connection, guildWallets } from '../../constants';
import { badgeMints } from '../../constants/badgeMints';
import { logger } from '../../logger';
import { AppState } from '../../state';
import { ShipStats } from '../../types';
import { getStakeShipData } from '../../utils/getStakeShipData';

export const createTakeFleetSnapshopshotJobHandler =
  (state: AppState) => async (name: string) => {
    console.time('Ships snapshot taken in');

    const shipsStatsCollection = state.database.shipStats();

    const ships = await pipe(
      fetchNfts(),
      TE.fold(
        () => T.of([]),
        (response) =>
          T.of(
            response.data.filter((ship) => ship.attributes.category === 'ship')
          )
      )
    )();

    const createdAt = new Date(new Date().setMinutes(0, 0, 0));

    let shipsStats: ShipStats = {
      createdAt,
      ships: {},
    };

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

    for (const [index, owner] of allOwners.entries()) {
      logger.info(
        `Getting snapshot for user ${owner}. ${index + 1} / ${allOwners.length}`
      );

      const stakeInfo = await getStakeShipData(connection, owner);

      for (const stake of stakeInfo) {
        const ship = ships.find((s) => s.mint === stake.shipMint.toString());

        if (ship) {
          shipsStats = {
            ...shipsStats,
            ships: {
              ...shipsStats.ships,
              [ship.mint]: {
                belongsToGuild: guildWallets.includes(owner),
                vwap: getEntityVwapPrice(ship.primarySales),
                mint: ship.mint,
                name: ship.name,
                attributes: ship.attributes,
                inWalletQuantity: 0,
                stakedQuantity:
                  (shipsStats.ships[ship.mint]?.stakedQuantity || 0) +
                  stake.shipQuantityInEscrow.toNumber(),
              },
            },
          };
        }
      }

      for (const ship of ships) {
        const balance = await getTokenBalanceByMint(
          connection,
          new PublicKey(owner),
          new PublicKey(ship.mint),
          true
        )();

        if (balance > 0) {
          shipsStats = {
            ...shipsStats,
            ships: {
              ...shipsStats.ships,
              [ship.mint]: {
                ...shipsStats.ships[ship.mint],
                inWalletQuantity:
                  (shipsStats.ships[ship.mint]?.inWalletQuantity || 0) +
                  balance,
              },
            },
          };
        }
      }
    }

    await shipsStatsCollection.insertOne(shipsStats);

    console.timeEnd('Ships snapshot taken in');
  };
