import {
  StarAtlasNft,
  getEntityVwapPrice,
  getOrdersByType,
} from '@saibase/star-atlas';
import { Connection } from '@solana/web3.js';
import { BN } from 'bn.js';
import * as E from 'fp-ts/Either';
import { create } from 'zustand';
import { getConnectionClusterUrl } from '../../utils/connection';
import { getAtlasMarketPrice } from '../../utils/getAtlasMarketPrice';

export type ShipTableRow = {
  id: string;
  imageUrl: string | undefined;
  name: string;
  vwapPrice: number;
  atlasBuyPrice: number;
  buyPriceVsVwapPrice?: number;
  atlasBuyPriceVsVwapPrice?: number;
  buyPrice: number;
  atlasSellPrice: number;
  sellPriceVsVwapPrice?: number;
  atlasSellPriceVsVwapPrice?: number;
  sellPrice: number;
};

type ShipsDealsStore = {
  isFetching: boolean;
  atlasPrice: number;
  data: ShipTableRow[];
  fetch: (ships: StarAtlasNft[], force?: boolean) => void;
};

export const useShipsDealsStore = create<ShipsDealsStore>((set, get) => ({
  atlasPrice: 0,
  data: [],
  isFetching: false,
  fetch: async (ships, force) => {
    if (get().isFetching) {
      return;
    }

    if (get().data.length && !force) {
      return;
    }

    set({ isFetching: true });

    const connection = new Connection(getConnectionClusterUrl('mainnet-beta'));

    const ordersEtiher = await getOrdersByType({
      connection,
    })();

    if (E.isLeft(ordersEtiher)) {
      return;
    }

    const orders = ordersEtiher.right;

    const atlasPrice = await getAtlasMarketPrice();

    const data = ships.map((ship) => {
      const vwapPrice =
        ship.tradeSettings.vwap ?? getEntityVwapPrice(ship.primarySales ?? []);

      const buyPrice = Math.min(
        ...(orders.usdc.sell
          .filter((order) => order.assetMint.toString() === ship.mint)
          ?.map((o) => o.price.div(new BN(1_000_000)).toNumber()) || [0])
      );

      const sellPrice = Math.max(
        ...(orders.usdc.buy
          .filter((order) => order.assetMint.toString() === ship.mint)
          ?.map((o) => o.price.div(new BN(1_000_000)).toNumber()) || [0])
      );

      const atlasBuyPrice = Math.min(
        ...(orders.atlas.sell
          .filter((order) => order.assetMint.toString() === ship.mint)
          ?.map((o) => o.price.div(new BN(100_000_000)).toNumber()) || [0])
      );

      const atlasSellPrice = Math.max(
        ...(orders.atlas.buy
          .filter((order) => order.assetMint.toString() === ship.mint)
          ?.map((o) => o.price.div(new BN(100_000_000)).toNumber()) || [0])
      );

      return {
        id: ship._id,
        imageUrl: ship?.media?.thumbnailUrl,
        name: ship.name,
        vwapPrice,
        atlasBuyPrice,
        buyPriceVsVwapPrice: buyPrice
          ? (1 - buyPrice / vwapPrice) * 100
          : undefined,
        atlasBuyPriceVsVwapPrice: atlasBuyPrice
          ? (1 - (atlasBuyPrice * atlasPrice) / vwapPrice) * 100
          : undefined,
        buyPrice,
        atlasSellPrice,
        sellPriceVsVwapPrice: sellPrice
          ? (1 - sellPrice / vwapPrice) * 100 * -1
          : undefined,
        atlasSellPriceVsVwapPrice: atlasSellPrice
          ? (1 - (atlasSellPrice * atlasPrice) / vwapPrice) * 100 * -1
          : undefined,
        sellPrice,
      };
    });

    set({ atlasPrice, data, isFetching: false });
  },
}));
