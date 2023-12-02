import { Connection, PublicKey } from '@solana/web3.js';
import { GmClientService } from '@staratlas/factory';
import * as E from 'fp-ts/Either';
import { BestPrices, Currency } from '../../entities';
import { getEntityOrderBook } from '../../market/getEntityOrderBook';

export const getEntityBestPrices = async (
  connection: Connection,
  mint: string,
  currency: Exclude<Currency, 'POLIS' | 'NONE'> = 'USDC'
): Promise<BestPrices> => {
  const gmClientService = new GmClientService();

  const result = await getEntityOrderBook({
    gmClientService,
    connection,
    mint: new PublicKey(mint),
  })();

  if (E.isLeft(result)) {
    return {
      avgPrice: -1,
      bestAskPrice: -1,
      bestBidPrice: -1,
    };
  }

  const currencyKey = currency.toLowerCase() as Lowercase<typeof currency>;

  const bestAskPrice = Math.min(
    ...result.right[currencyKey].sell.map((o) => o.uiPrice)
  );

  const bestBidPrice = Math.max(
    ...result.right[currencyKey].buy.map((o) => o.uiPrice)
  );

  return {
    avgPrice: (bestAskPrice + bestBidPrice) / 2,
    bestAskPrice,
    bestBidPrice,
  };
};
