import { fetchNftsByCategory, getOrderBooks } from '@saibase/star-atlas';
import { Connection } from '@solana/web3.js';
import { GmClientService } from '@staratlas/factory';
import * as E from 'fp-ts/Either';
import { NextApiRequest, NextApiResponse } from 'next';
import { mongo } from '../../../mongodb';

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

  const orderbooks = await getOrderBooks({
    gmClientService: new GmClientService(),
    connection: new Connection(process.env.RPC_API_BASE_URL),
  });

  const result = ships.map((ship) => {
    const shipStats = shipsStats.find((stats) => stats.mint === ship.mint);

    return {
      mint: ship.mint,
      name: ship.name,
      image: ship.image,
      data: {
        info: {
          model: ship.attributes.model,
          symbol: ship.symbol,
          class: ship.attributes.class,
          description: ship.description,
          rarity: ship.attributes.rarity,
          spec: ship.attributes.spec,
          manufacturer: ship.attributes.make,
          width: ship.attributes.unitWidth,
          height: ship.attributes.unitHeight,
          length: ship.attributes.unitLength,
        },
        components: {},
        modules: [],
        combat: {},
        crew: [],
        media: {},
      },
      sai: {
        specBadge: '',
      },
      market: {
        vwap: ship.tradeSettings?.vwap || 0,
        originationPrice: ship.tradeSettings.msrp?.value || 0,
        bestUsdcBidPrice: Math.min(
          ...(orderbooks.usdc.sell[ship.mint]?.map((o) => o.uiPrice) || [0])
        ),
      },
      score: {},
      sage: shipStats,
    };
  });

  res.status(200).json({ success: true, data: result });
}
