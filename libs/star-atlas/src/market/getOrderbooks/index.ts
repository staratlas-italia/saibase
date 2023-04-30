import { mints } from '@saibase/constants';
import { Connection } from '@solana/web3.js';
import { GmClientService, Order } from '@staratlas/factory';
import { groupBy } from 'lodash';
import { saMarketplaceProgramId } from '../../constants';

type Param = {
  connection: Connection;
  gmClientService: GmClientService;
};

// TODO: refactor using fp-ts
export const getOrderBooks = async ({ gmClientService, connection }: Param) => {
  const usdcOrders = await gmClientService.getOpenOrdersForCurrency(
    connection,
    mints.usdc,
    saMarketplaceProgramId
  );

  const atlasOrders = await gmClientService.getOpenOrdersForCurrency(
    connection,
    mints.atlas,
    saMarketplaceProgramId
  );

  const atlasOrdersByType = groupBy(atlasOrders, 'orderType') as Record<
    'buy' | 'sell',
    Order[]
  >;

  const usdcOrdersByType = groupBy(usdcOrders, 'orderType') as Record<
    'buy' | 'sell',
    Order[]
  >;

  return {
    atlas: {
      buy: groupBy(atlasOrdersByType.buy, 'orderMint'),
      sell: groupBy(atlasOrdersByType.sell, 'orderMint'),
    },
    usdc: {
      buy: groupBy(usdcOrdersByType.buy, 'orderMint'),
      sell: groupBy(usdcOrdersByType.sell, 'orderMint'),
    },
  };
};
