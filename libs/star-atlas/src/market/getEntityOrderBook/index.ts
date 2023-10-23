import { mints } from '@saibase/constants';
import { createError } from '@saibase/errors';
import { Connection, PublicKey } from '@solana/web3.js';
import { GmClientService, Order } from '@staratlas/factory';
import * as E from 'fp-ts/Either';
import * as A from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { saGalacticMarketplaceProgramId } from '../../constants';

type Param = {
  connection: Connection;
  gmClientService: GmClientService;
  mint: PublicKey;
};

export const getEntityOrderBook = ({
  gmClientService,
  connection,
  mint,
}: Param) =>
  pipe(
    TE.tryCatch(
      () =>
        gmClientService.getOpenOrdersForAsset(
          connection,
          mint,
          saGalacticMarketplaceProgramId
        ),
      createError('FetchOpenOrdersError')
    ),
    TE.map(
      flow(
        A.map((order) =>
          order.currencyMint === mints.atlas.toString()
            ? E.left(order)
            : E.right(order)
        ),
        A.separate
      )
    ),
    TE.map(({ left: atlasOrders, right: usdcOrders }) => {
      const atlasOrdersByType = RNEA.groupBy((order: Order) => order.orderType)(
        atlasOrders
      ) as Readonly<
        Partial<Record<'buy' | 'sell', RNEA.ReadonlyNonEmptyArray<Order>>>
      >;

      const usdcOrdersByType = RNEA.groupBy((order: Order) => order.orderType)(
        usdcOrders
      ) as Readonly<
        Partial<Record<'buy' | 'sell', RNEA.ReadonlyNonEmptyArray<Order>>>
      >;

      return {
        atlas: {
          buy: atlasOrdersByType.buy || [],
          sell: atlasOrdersByType.sell || [],
        },
        usdc: {
          buy: usdcOrdersByType.buy || [],
          sell: usdcOrdersByType.sell || [],
        },
      };
    })
  );
