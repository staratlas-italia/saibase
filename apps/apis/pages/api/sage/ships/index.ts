import { fetchNftsByCategory } from '@saibase/star-atlas';
import * as E from 'fp-ts/Either';
import { NextApiRequest, NextApiResponse } from 'next';
import { mongo } from '../../../../mongodb';

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

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const collection = mongo.collection<SageShipsStats>('sage-ships-stats');
  const shipsStats = await collection.find().toArray();
  const shipsEither = await fetchNftsByCategory({ category: 'ship' })();

  if (E.isLeft(shipsEither)) {
    return res
      .status(400)
      .json({ success: false, error: shipsEither.left.error.message });
  }

  const ships = shipsEither.right;

  const result = ships.map((ship) => {
    const shipStats = shipsStats.find((stats) => stats.mint === ship.mint);
    return {
      ...shipStats,
      name: ship.name,
      description: ship.description,
      symbol: ship.symbol,
      model: ship.attributes.model,
      manufacturer: ship.attributes.make,
      rarity: ship.attributes.rarity,
      spec: ship.attributes.spec,
      class: ship.attributes.class,
      classSize: shipStats?.class,
    };
  });

  res.status(200).json({ success: true, data: result });
}
