import { mints } from '@saibase/constants';
import { TaskEitherRightType, createError } from '@saibase/errors';
import {
  Connection,
  PublicKey,
  TransactionConfirmationStatus,
} from '@solana/web3.js';
import { readAllFromRPC } from '@staratlas/data-source';
import {
  GalacticMarketplaceProgram,
  Order,
} from '@staratlas/galactic-marketplace';
import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { saGalacticMarketplaceProgramId } from '../../constants';
import { buildAnchorProvider } from '../../utils/buildAnchorProvider';

type Param = {
  connection: Connection;
  assetMint?: PublicKey;
  commitment?: TransactionConfirmationStatus;
};

type Data = TaskEitherRightType<ReturnType<typeof getOrders>>['atlas'];

const groupByOrderType = (orders: Data) =>
  pipe(
    orders,
    A.partitionMap((order) =>
      Object.keys(order.orderSide).includes('buy')
        ? E.right(order)
        : E.left(order)
    ),
    ({ left: sell, right: buy }) => ({ buy, sell })
  );

const getOrders = ({ connection, commitment, assetMint }: Param) =>
  pipe(
    TE.tryCatch(
      () =>
        readAllFromRPC(
          connection,
          GalacticMarketplaceProgram.buildProgram(
            saGalacticMarketplaceProgramId,
            buildAnchorProvider(connection)
          ),
          Order,
          commitment,
          assetMint
            ? [
                {
                  memcmp: {
                    offset: 72,
                    bytes: assetMint.toString(),
                  },
                },
              ]
            : undefined
        ),
      createError('GetOrdersError')
    ),
    TE.map(
      flow(
        A.partitionMap((order) =>
          order.type === 'ok' ? E.right(order.data.data) : E.left(order.error)
        )
      )
    ),
    TE.map(({ right }) =>
      pipe(
        right,
        A.partitionMap((order) =>
          order.currencyMint.equals(mints.usdc) ? E.right(order) : E.left(order)
        )
      )
    ),
    TE.map(({ left: atlas, right: usdc }) => ({
      usdc,
      atlas,
    }))
  );

export const getOrdersByType = (param: Param) =>
  pipe(
    getOrders(param),
    TE.map(({ atlas, usdc }) => ({
      usdc: groupByOrderType(usdc),
      atlas: groupByOrderType(atlas),
    }))
  );
