import { mints } from '@saibase/constants';
import { createError } from '@saibase/errors';
import { Connection } from '@solana/web3.js';
import { GmClientService, Order } from '@staratlas/factory';
import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import * as NEA from 'fp-ts/NonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { saGalacticMarketplaceProgramId } from '../../constants';

type Param = {
  connection: Connection;
  gmClientService: GmClientService;
};

const groupByOrderMint = (orders: Order[]) =>
  pipe(
    orders,
    NEA.groupBy((order) => order.orderMint)
  );

const groupByOrderType = (orders: Order[]) =>
  pipe(
    orders,
    A.partitionMap((order) =>
      order.orderType === 'buy' ? E.right(order) : E.left(order)
    ),
    ({ left: buyOrders, right: sellOrders }) => ({
      buy: buyOrders,
      sell: sellOrders,
    })
  );

export const getOrderBooks = ({ gmClientService, connection }: Param) =>
  pipe(
    TE.Do,
    TE.bind('usdcOrders', () =>
      TE.tryCatch(
        () =>
          gmClientService.getOpenOrdersForCurrency(
            connection,
            mints.usdc,
            saGalacticMarketplaceProgramId
          ),
        createError('GetUsdcOpenOrdersError')
      )
    ),
    TE.bindW('atlasOrders', () =>
      TE.tryCatch(
        () =>
          gmClientService.getOpenOrdersForCurrency(
            connection,
            mints.atlas,
            saGalacticMarketplaceProgramId
          ),
        createError('GetAtlasOpenOrdersError')
      )
    ),
    TE.bindW('usdc', ({ usdcOrders }) =>
      TE.right(groupByOrderType(usdcOrders))
    ),
    TE.bindW('atlas', ({ atlasOrders }) =>
      TE.right(groupByOrderType(atlasOrders))
    ),
    TE.map(({ atlas, usdc }) => ({
      atlas: {
        buy: groupByOrderMint(atlas.buy),
        sell: groupByOrderMint(atlas.sell),
      },
      usdc: {
        buy: groupByOrderMint(usdc.buy),
        sell: groupByOrderMint(usdc.sell),
      },
    }))
  );
