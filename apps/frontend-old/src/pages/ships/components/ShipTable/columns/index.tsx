import { ExternalLinkIcon } from '@heroicons/react/solid';
import { getPublicRoute } from '@saibase/routes-public';
import { Flex, Price, Text } from '@saibase/uikit';
import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';
import { MarketAction } from '..';
import { ShipTableRow } from '../../../../../stores/useShipsDealsStore';
import { fillUrlParameters } from '../../../../../utils/fillUrlParameters';

type Param = {
  action: MarketAction;
  locale?: string;
  formatMessage: (p: any) => string;
  atlasPrice: number;
};

const columnHelper = createColumnHelper<ShipTableRow>();

export const columns = ({
  action,
  locale,
  formatMessage,
  atlasPrice,
}: Param) => [
  columnHelper.accessor('name', {
    minSize: 200,
    enableSorting: false,
    header: formatMessage({
      id: 'Ships.Table.Column.name',
    }),
    cell: (info) => (
      <Flex align="center" direction="row" className="space-x-3">
        <Image
          alt={info.row.original.name || ''}
          width={48}
          height={48}
          src={info.row.original.imageUrl || ''}
          className="object-cover"
        />

        <Text>{info.getValue()}</Text>
      </Flex>
    ),
  }),
  columnHelper.accessor(action === 'buy' ? 'buyPrice' : 'sellPrice', {
    header: formatMessage({
      id: 'Ships.Table.Column.price',
    }),
    cell: (info) => (
      <Flex justify="end" grow={1}>
        <Price currency="USDC" value={info.getValue()} />
      </Flex>
    ),
  }),
  columnHelper.accessor(action === 'buy' ? 'atlasBuyPrice' : 'atlasSellPrice', {
    minSize: 175,
    header: formatMessage({
      id: 'Ships.Table.Column.atlasPrice',
    }),
    cell: (info) => (
      <Flex justify="end">
        {info.getValue() ? (
          <Flex align="end" className="space-y-1" direction="col">
            <Price currency={'ATLAS'} value={info.getValue()} />

            <Price
              currency={'USDC'}
              value={(info.getValue() ?? 0) * atlasPrice}
            />
          </Flex>
        ) : (
          '-'
        )}
      </Flex>
    ),
  }),
  columnHelper.accessor('vwapPrice', {
    header: formatMessage({
      id: 'Ships.Table.Column.vwap',
    }),
    cell: (info) => (
      <Flex justify="end">
        <Price currency="USDC" value={info.getValue()} />
      </Flex>
    ),
  }),
  columnHelper.accessor(
    action === 'buy' ? 'buyPriceVsVwapPrice' : 'sellPriceVsVwapPrice',
    {
      minSize: 200,
      header: formatMessage({
        id: 'Ships.Table.Column.priceVsVwapPrice',
      }),
      cell: (info) => (
        <Flex justify="end">
          <Text
            align="center"
            weight="medium"
            color={
              (info.getValue() as number) > 0
                ? 'text-emerald-300'
                : 'text-red-300'
            }
            className="px-4 py-2"
          >
            {info.getValue() ? (
              <>{Math.abs(info.getValue() as number).toFixed(2)}%</>
            ) : (
              '-'
            )}
          </Text>
        </Flex>
      ),
    }
  ),
  columnHelper.accessor(
    action === 'buy' ? 'atlasBuyPriceVsVwapPrice' : 'atlasSellPriceVsVwapPrice',
    {
      minSize: 200,
      header: formatMessage({
        id: 'Ships.Table.Column.atlasPriceVsVwapPrice',
      }),
      cell: (info) => (
        <Flex justify="end">
          <Text
            align="center"
            weight="medium"
            color={
              (info.getValue() as number) > 0
                ? 'text-emerald-300'
                : 'text-red-300'
            }
            className="px-4 py-2"
          >
            {info.getValue() ? (
              <>{Math.abs(info.getValue() as number).toFixed(2)}%</>
            ) : (
              '-'
            )}
          </Text>
        </Flex>
      ),
    }
  ),
  columnHelper.display({
    size: 50,
    id: 'actions',
    cell: ({ row }) => (
      <Flex px={3}>
        <Link
          href={fillUrlParameters(getPublicRoute('/ships/:shipId'), {
            shipId: row.original.id || '',
          })}
          locale={locale}
          target="_blank"
        >
          <ExternalLinkIcon className="h-5 w-5" />
        </Link>
      </Flex>
    ),
  }),
];
