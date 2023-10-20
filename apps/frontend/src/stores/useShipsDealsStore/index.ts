import {
  StarAtlasNft,
  getEntityVwapPrice,
  getOrderBooks,
} from '@saibase/star-atlas';
import { Connection } from '@solana/web3.js';
import * as E from 'fp-ts/Either';
import { create } from 'zustand';
import { gmClientService } from "../../common/constants";
import { getConnectionClusterUrl } from "../../utils/connection";
import { getAtlasMarketPrice } from "../../utils/getAtlasMarketPrice";

export type ShipTableRow = {
  id: string;
  imageUrl: string;
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

    const orderbooksEither = await getOrderBooks({
      connection,
      gmClientService,
    })();

    if (E.isLeft(orderbooksEither)) {
      return;
    }

    const orderbooks = orderbooksEither.right;

    const atlasPrice = await getAtlasMarketPrice();

    const data = ships.map((ship) => {
      const vwapPrice = getEntityVwapPrice(ship.primarySales);

      const buyPrice = Math.min(
        ...(orderbooks.usdc.sell[ship.mint]?.map((o) => o.uiPrice) || [0])
      );

      const sellPrice = Math.max(
        ...(orderbooks.usdc.buy[ship.mint]?.map((o) => o.uiPrice) || [0])
      );

      const atlasBuyPrice = Math.min(
        ...(orderbooks.atlas.sell[ship.mint]?.map((o) => o.uiPrice) || [0])
      );

      const atlasSellPrice = Math.max(
        ...(orderbooks.atlas.buy[ship.mint]?.map((o) => o.uiPrice) || [0])
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
