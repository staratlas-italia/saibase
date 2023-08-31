import { fetchNftsByCategory, getOrderBooks } from '@saibase/star-atlas';
import { Connection } from '@solana/web3.js';
import { GmClientService } from '@staratlas/factory';
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
    return res.status(400).json([]);
  }

  const ships = shipsEither.right;

  const orderbooks = await getOrderBooks({
    gmClientService: new GmClientService(),
    connection: new Connection(process.env.RPC_API_BASE_URL),
  });

  const result = ships.map((ship) => {
    const shipStats = shipsStats.find((stats) => stats.mint === ship.mint);

    const vwap = ship.tradeSettings?.vwap
      ? Math.round(ship.tradeSettings.vwap * 100) / 100
      : 0;

    const originationPrice = ship.tradeSettings?.msrp?.value
      ? Math.round(ship.tradeSettings.msrp.value * 100) / 100
      : 0;

    const bestUsdcBidPrice = Math.min(
      ...(orderbooks.usdc.sell[ship.mint]?.map((o) => o.uiPrice) || [0])
    );
    const bestUsdcAskPrice = Math.max(
      ...(orderbooks.usdc.buy[ship.mint]?.map((o) => o.uiPrice) || [0])
    );

    const bestUsdcBidPriceVsVwap =
      bestUsdcBidPrice && vwap > 0
        ? Math.round((1 - bestUsdcBidPrice / vwap) * 10000 * -1) / 100
        : undefined;

    const bestUsdcAskPriceVsVwap = bestUsdcAskPrice
      ? Math.round((1 - bestUsdcAskPrice / vwap) * 10000 * -1) / 100
      : undefined;

    return {
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
      bestUsdcBidPrice,
      bestUsdcBidPriceVsVwap,
      bestUsdcAskPrice,
      bestUsdcAskPriceVsVwap,
      ...shipStats,
      classSize: shipStats?.class,
    };
  });

  res.status(200).json(result);
}
