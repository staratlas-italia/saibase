import { StarAtlasNft, fetchNftsByCategory } from '@saibase/star-atlas';
import {
  Cluster,
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { createHarvestInstruction } from '@staratlas/factory';
import { pipe } from 'fp-ts/function';
import { chunk } from 'lodash';
import { create } from 'zustand';
import { ATLAS_TOKEN_MINT, SA_FLEET_PROGRAM } from '../../common/constants';
import { fetchPlayerStakeShips } from '../../network/score';
import { NormalizedShipStakingInfoExtended } from '../../types';
import { promiseFromTaskEither } from '../../utils/promiseFromTaskEither';

type FleetData = {
  ship: StarAtlasNft;
  stakeInfo?: NormalizedShipStakingInfoExtended;
};

type FleetStore = {
  fleet: FleetData[] | null;
  isFetching: boolean;
  clear: () => void;
  fetchFleet: (cluster: Cluster, publicKey: PublicKey) => void;
  getClaimAllTransactions: (
    connection: Connection,
    publicKey: PublicKey
  ) => Promise<Transaction[]>;
};

export const useFleetClaimAmount = () => {
  return useFleetStore((s) =>
    s.fleet?.reduce((acc, s) => (acc += s.stakeInfo?.pendingRewardsV2 || 0), 0)
  );
};

export const useFleetStore = create<FleetStore>((set, get) => ({
  fleet: null,
  isFetching: false,
  fetchFleet: async (cluster, publicKey) => {
    if (get().fleet || get().isFetching) {
      return;
    }

    set({ isFetching: true });

    const response = await fetchPlayerStakeShips(cluster, publicKey.toString());

    if (response.success) {
      const { data: playerFleet } = response;
      const ships = await pipe(
        fetchNftsByCategory({ category: 'ship' }),
        promiseFromTaskEither
      );

      const mints = playerFleet.map((i) => i.shipMint);
      const fleetShips = ships.filter((item) => mints.includes(item.mint));

      const fleet = fleetShips.map((ship) => ({
        ship,
        stakeInfo: playerFleet.find((item) => item.shipMint === ship.mint),
      }));

      set({ fleet, isFetching: false });

      return;
    }

    set({ fleet: [], isFetching: false });
  },
  getClaimAllTransactions: async (connection, publicKey) => {
    const instructions = await getHarvestAllInstructions(
      connection,
      publicKey,
      get().fleet || []
    );

    const biIxs = chunk(instructions, 2) as [
      TransactionInstruction,
      TransactionInstruction
    ][];

    const latestBlockHash = await connection.getLatestBlockhash();

    const txs = biIxs.map((biIx) =>
      new Transaction({
        ...latestBlockHash,
        feePayer: publicKey,
      }).add(...biIx)
    );

    return txs;
  },
  clear: () => set({ fleet: [] }),
}));

const getHarvestAllInstructions = async (
  connection: Connection,
  player: PublicKey,
  fleets: FleetData[]
) => {
  const ixs = (
    await Promise.all(
      fleets.map(async (fleet) => {
        if (fleet.stakeInfo?.pendingRewardsV2) {
          return createHarvestInstruction(
            connection,
            player,
            ATLAS_TOKEN_MINT,
            new PublicKey(fleet.ship.mint),
            SA_FLEET_PROGRAM
          );
        }

        return null;
      })
    )
  ).filter((ix) => !!ix);

  const instructions = ixs.flatMap((r) => r?.instructions).filter((ix) => !!ix);

  return instructions as TransactionInstruction[];
};
