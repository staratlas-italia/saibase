import { matchMethodMiddleware } from '@saibase/middlewares';
import { fetchNftsByCategory } from '@saibase/star-atlas';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import { NextApiRequest, NextApiResponse } from 'next';
import { mongo } from '../../../../mongodb';
import { handleErrors } from '../../../../utils/handleErrors';

type SageShipsStats = {
  mint: string;
  class: number;
  lp: number;
  cargoCapacity: number;
  fuelCapacity: number;
  ammoCapacity: number;
  miningFoodPerSecond: number;
  miningAmmoPerSecond: number;
  miningResourcesPerSecond: number;
  subwarpSpeed: number;
  warpSpeed: number;
  maxWarpDistance: number;
  baseWarpCooldown: number;
  fuelAuWarped: number;
  fuelAUSubwarp: number;
  fuelAsteroidExit: number;
  scanCooldownSeconds: number;
  foodCrew: number;
  craftingActiveCrew: number;
  respawnTime: number;
  foodScan: number;
};

// TODO: move this di @saibase/sai-database
const collection = mongo.collection<SageShipsStats>('sage-ships-stats');

const handler = async (_: NextApiRequest, res: NextApiResponse) => {
  try {
    const shipsStats = await collection.find().toArray();

    const shipsEither = await fetchNftsByCategory({ category: 'ship' })();

    if (E.isLeft(shipsEither)) {
      console.log(shipsEither.left);
      return res.status(400).json({ status: 400, error: 'Cannot get ships' });
    }

    const ships = shipsEither.right;

    const result = ships.map((ship) => {
      const shipStats = shipsStats.find((stats) => stats.mint === ship.mint);

      const vwap = ship.tradeSettings?.vwap
        ? Math.round(ship.tradeSettings.vwap * 100) / 100
        : 0;

      const originationPrice = ship.tradeSettings?.msrp?.value
        ? Math.round(ship.tradeSettings.msrp.value * 100) / 100
        : 0;

      return {
        ...shipStats,
        classSize: shipStats?.class,
        mint: ship.mint,
        name: ship.name,
        symbol: ship.symbol,
        model: ship.attributes.model,
        manufacturer: ship.attributes.make,
        image: ship.image,
        class: ship.attributes.class,
        rarity: ship.attributes.rarity,
        spec: ship.attributes.spec,
        saiSpecBadge: '',
        modules: ship.slots?.moduleSlots,
        crew: ship.slots?.crewSlots,
        firepower: 0,
        vwap,
        originationPrice,
        currentSupply: ship.totalSupply,
      };
    });

    res.status(200).json(result);
  } catch (err) {
    err instanceof Error
      ? handleErrors(err, res)
      : handleErrors(new Error('An unexpected error occurred.'), res);
  }
};

export default pipe(handler, matchMethodMiddleware(['GET']));
