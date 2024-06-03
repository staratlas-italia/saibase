import {
  StarAtlasNft,
  fetchNftsByCategory,
  getEntityVwapPrice,
} from '@saibase/star-atlas';
import { getTokenBalanceByMint } from '@saibase/web3';
import { PublicKey } from '@solana/web3.js';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { connection } from '../../../constants';
import { AppState } from '../../../state';
import { ShipStats } from '../../../types';
import { getStakeShipData } from '../../../utils/getStakeShipData';

export const fetchFleetStatsByOwners = async (
  state: AppState,
  owners: string[]
) => {
  const ships = await pipe(
    fetchNftsByCategory({ category: 'ship' }),
    TE.getOrElseW(() => T.of([] as StarAtlasNft[]))
  )();

  const createdAt = new Date(new Date().setMinutes(0, 0, 0));

  let shipsStats: ShipStats = {
    createdAt,
    ships: {},
  };

  for (const [index, owner] of owners.entries()) {
    state.logger.info(
      `Getting snapshot for user ${owner}. ${index + 1} / ${owners.length}`
    );

    const stakeInfo = await getStakeShipData(connection, owner);

    for (const ship of ships) {
      const stake = stakeInfo.find((s) => s.shipMint.toString() === ship.mint);

      const balance = await getTokenBalanceByMint(
        connection,
        new PublicKey(owner),
        new PublicKey(ship.mint),
        true
      )();

      if (stake || balance > 0) {
        shipsStats = {
          ...shipsStats,
          ships: {
            ...shipsStats.ships,
            [ship.mint]: {
              ...shipsStats.ships[ship.mint],
              vwap: getEntityVwapPrice(ship.primarySales ?? []),
              mint: ship.mint,
              name: ship.name,
              attributes: ship.attributes,
              inWalletQuantity:
                (shipsStats.ships[ship.mint]?.inWalletQuantity || 0) + balance,
              stakedQuantity: stake
                ? (shipsStats.ships[ship.mint]?.stakedQuantity || 0) +
                  stake.shipQuantityInEscrow.toNumber()
                : 0,
            },
          },
        };
      }
    }
  }

  return shipsStats;
};
