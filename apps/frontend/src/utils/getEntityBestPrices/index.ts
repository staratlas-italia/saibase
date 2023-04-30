import { getEntityOrderBook } from '@saibase/star-atlas';
import { Connection, PublicKey } from '@solana/web3.js';
import * as E from 'fp-ts/Either';
import { gmClientService } from '../../common/constants';
import { BestPrices, Currency } from '../../types';
import { getConnectionClusterUrl } from '../connection';

export const getEntityBestPrices = async (
  mint: string,
  currency: Exclude<Currency, 'POLIS' | 'NONE'> = 'USDC'
): Promise<BestPrices | undefined> => {
  const connection = new Connection(getConnectionClusterUrl('mainnet-beta'));

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
