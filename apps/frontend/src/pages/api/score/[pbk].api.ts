import { BN } from '@project-serum/anchor';
import { fetchAllFleets, getShipInfo } from '@saibase/star-atlas';
import { parsePublicKey } from '@saibase/web3';
import { Cluster, Connection } from '@solana/web3.js';
import { ShipStakingInfo } from '@staratlas/factory';
import * as E from 'fp-ts/Either';
import * as A from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  ARMS_PRICE,
  FOOD_PRICE,
  FUEL_PRICE,
  TOOLKIT_PRICE,
} from '~/common/constants';
import { ScoreFleetResponse } from '~/types/api';
import { getConnectionClusterUrl } from '~/utils/connection';
import { dailyMaintenanceCostInAtlas } from '~/utils/dailyMaintenanceCostInAtlas';
import { grossDailyRewardInAtlas } from '~/utils/grossDailyRewardInAtlas';
import { netDailyRewardInAtlas } from '~/utils/netDailyRewardInAtlas';
import { resDailyConsumption } from '~/utils/resDailyConsumption';
import { resDailyCostInAtlas } from '~/utils/resDailyCostInAtlas';

const getReward = (fleet: ShipStakingInfo, rewardRate: number) => {
  const now = Date.now() / 1000;

  const tripStart = fleet.currentCapacityTimestamp.toNumber();
  const timePass = now - tripStart;

  const pendingReward = fleet.shipQuantityInEscrow
    .mul(fleet.totalTimeStaked.sub(fleet.stakedTimePaid).add(new BN(timePass)))
    .mul(new BN(rewardRate))
    .toNumber();

  return pendingReward;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ScoreFleetResponse | any>
) => {
  const {
    query: { cluster, pbk },
  } = req;

  const connection = new Connection(
    getConnectionClusterUrl(cluster as Cluster)
  );

  const result = await pipe(
    parsePublicKey(pbk as string),
    TE.fromEither,
    TE.orElseFirstIOK(
      () => () =>
        res.status(200).json({
          success: false,
          error: 'Invalid pubkey',
        })
    ),
    TE.chainW((player) =>
      pipe(
        TE.Do,
        TE.bind('fleet', () => fetchAllFleets({ connection, player })),
        TE.bindW('fleetVars', ({ fleet }) =>
          pipe(
            fleet,
            TE.traverseArray((account) =>
              getShipInfo({ connection, shipMint: account.shipMint })
            )
          )
        )
      )
    ),
    TE.map(({ fleet, fleetVars }) => A.zip(fleet, fleetVars))
  )();

  if (E.isLeft(result)) {
    const error = result.left;

    return res
      .status(400)
      .json({ type: error.type, message: error.error.message });
  }

  return res.status(200).json({
    success: true,
    date: new Date(new Date().toUTCString()).toISOString(),
    data: result.right.map(([account, vars]) => ({
      owner: account.owner.toString(),
      factionId: account.factionId.toString(),
      shipMint: account.shipMint.toString(),
      shipQuantityInEscrow: account.shipQuantityInEscrow.toNumber(),
      fuelQuantityInEscrow: account.fuelQuantityInEscrow.toNumber(),
      foodQuantityInEscrow: account.foodQuantityInEscrow.toNumber(),
      armsQuantityInEscrow: account.armsQuantityInEscrow.toNumber(),
      fuelCurrentCapacity: account.fuelCurrentCapacity.toNumber(),
      foodCurrentCapacity: account.foodCurrentCapacity.toNumber(),
      armsCurrentCapacity: account.armsCurrentCapacity.toNumber(),
      healthCurrentCapacity: account.healthCurrentCapacity.toNumber(),
      stakedAtTimestamp: account.stakedAtTimestamp.toNumber(),
      fueledAtTimestamp: account.fueledAtTimestamp.toNumber(),
      fedAtTimestamp: account.fedAtTimestamp.toNumber(),
      armedAtTimestamp: account.armedAtTimestamp.toNumber(),
      repairedAtTimestamp: account.repairedAtTimestamp.toNumber(),
      currentCapacityTimestamp: account.currentCapacityTimestamp.toNumber(),
      totalTimeStaked: account.totalTimeStaked.toNumber(),
      stakedTimePaid: account.stakedTimePaid.toNumber(),
      pendingRewards: account.pendingRewards.toNumber(),
      pendingRewardsV2:
        getReward(account, vars.rewardRatePerSecond.toNumber()) /
        Math.pow(10, 8),
      totalRewardsPaid: account.totalRewardsPaid.toNumber(),
      /* Vars */
      rewardRatePerSecond: vars.rewardRatePerSecond.toNumber(),
      fuelMaxReserve: vars.fuelMaxReserve,
      foodMaxReserve: vars.foodMaxReserve,
      armsMaxReserve: vars.armsMaxReserve,
      toolkitMaxReserve: vars.toolkitMaxReserve,
      millisecondsToBurnOneFuel: vars.millisecondsToBurnOneFuel,
      millisecondsToBurnOneFood: vars.millisecondsToBurnOneFood,
      millisecondsToBurnOneArms: vars.millisecondsToBurnOneArms,
      millisecondsToBurnOneToolkit: vars.millisecondsToBurnOneToolkit,
      /* Custom values */
      dailyFuelConsumption: resDailyConsumption(
        vars.millisecondsToBurnOneFuel,
        account.shipQuantityInEscrow.toNumber()
      ),
      dailyFoodConsumption: resDailyConsumption(
        vars.millisecondsToBurnOneFood,
        account.shipQuantityInEscrow.toNumber()
      ),
      dailyArmsConsumption: resDailyConsumption(
        vars.millisecondsToBurnOneArms,
        account.shipQuantityInEscrow.toNumber()
      ),
      dailyToolkitConsumption: resDailyConsumption(
        vars.millisecondsToBurnOneToolkit,
        account.shipQuantityInEscrow.toNumber()
      ),
      dailyFuelCostInAtlas: resDailyCostInAtlas(
        FUEL_PRICE,
        vars.millisecondsToBurnOneFuel,
        account.shipQuantityInEscrow.toNumber()
      ),
      dailyFoodCostInAtlas: resDailyCostInAtlas(
        FOOD_PRICE,
        vars.millisecondsToBurnOneFood,
        account.shipQuantityInEscrow.toNumber()
      ),
      dailyArmsCostInAtlas: resDailyCostInAtlas(
        ARMS_PRICE,
        vars.millisecondsToBurnOneArms,
        account.shipQuantityInEscrow.toNumber()
      ),
      dailyToolkitCostInAtlas: resDailyCostInAtlas(
        TOOLKIT_PRICE,
        vars.millisecondsToBurnOneToolkit,
        account.shipQuantityInEscrow.toNumber()
      ),
      dailyMaintenanceCostInAtlas: dailyMaintenanceCostInAtlas(
        resDailyCostInAtlas(
          FUEL_PRICE,
          vars.millisecondsToBurnOneFuel,
          account.shipQuantityInEscrow.toNumber()
        ),
        resDailyCostInAtlas(
          FOOD_PRICE,
          vars.millisecondsToBurnOneFood,
          account.shipQuantityInEscrow.toNumber()
        ),
        resDailyCostInAtlas(
          ARMS_PRICE,
          vars.millisecondsToBurnOneArms,
          account.shipQuantityInEscrow.toNumber()
        ),
        resDailyCostInAtlas(
          TOOLKIT_PRICE,
          vars.millisecondsToBurnOneToolkit,
          account.shipQuantityInEscrow.toNumber()
        )
      ),
      grossDailyRewardInAtlas: grossDailyRewardInAtlas(
        vars.rewardRatePerSecond.toNumber(),
        account.shipQuantityInEscrow.toNumber()
      ),
      netDailyRewardInAtlas: netDailyRewardInAtlas(
        grossDailyRewardInAtlas(
          vars.rewardRatePerSecond.toNumber(),
          account.shipQuantityInEscrow.toNumber()
        ),
        dailyMaintenanceCostInAtlas(
          resDailyCostInAtlas(
            FUEL_PRICE,
            vars.millisecondsToBurnOneFuel,
            account.shipQuantityInEscrow.toNumber()
          ),
          resDailyCostInAtlas(
            FOOD_PRICE,
            vars.millisecondsToBurnOneFood,
            account.shipQuantityInEscrow.toNumber()
          ),
          resDailyCostInAtlas(
            ARMS_PRICE,
            vars.millisecondsToBurnOneArms,
            account.shipQuantityInEscrow.toNumber()
          ),
          resDailyCostInAtlas(
            TOOLKIT_PRICE,
            vars.millisecondsToBurnOneToolkit,
            account.shipQuantityInEscrow.toNumber()
          )
        )
      ),
    })),
  });
};

export default handler;
