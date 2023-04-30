import { Flex } from '@saibase/uikit';
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Image from 'next/image';
import { useEffect, useState } from 'react';
type Props<T, V> = {
  columns: ColumnDef<T, V>[];
  data: T[];
  fetchData?: () => void;
  loading?: boolean;
};

export const Table = <T, V>({
  columns,
  data,
  fetchData,
  loading,
}: Props<T, V>) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    columns,
    data,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => fetchData?.(), [fetchData]);

  return (
    <table className="table-auto text-white">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) =>
              header.isPlaceholder ? null : (
                <th
                  key={header.id}
                  style={{
                    minWidth: header.getSize(),
                  }}
                  colSpan={header.colSpan}
                  className="select-none cursor-pointer py-2"
                  onClick={() => header.column.toggleSorting()}
                >
                  <Flex align="center" className="space-x-1">
                    <Flex>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </Flex>

                    <>
                      {header.column.getCanSort() ? (
                        header.column.getIsSorted() ? (
                          header.column.getIsSorted() === 'desc' ? (
                            <Image
                              alt="arrow down"
                              width={20}
                              height={20}
                              src="/images/table/arrow_drop_down_white_24dp.svg"
                            />
                          ) : (
                            <Image
                              alt="arrow up"
                              width={20}
                              height={20}
                              src="/images/table/arrow_drop_up_white_24dp.svg"
                            />
                          )
                        ) : (
                          <Flex direction="col" className="-space-y-3">
                            <Image
                              alt="arrow up"
                              width={20}
                              height={20}
                              src="/images/table/arrow_drop_up_white_24dp.svg"
                            />

                            <Image
                              alt="arrow down"
                              width={20}
                              height={20}
                              src="/images/table/arrow_drop_down_white_24dp.svg"
                            />
                          </Flex>
                        )
                      ) : null}
                    </>
                  </Flex>
                </th>
              )
            )}
          </tr>
        ))}
      </thead>

      <tbody className="divide-y-2 divide-primary">
        {loading
          ? null
          : table.getRowModel().rows.map((row, i) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
      </tbody>
    </table>
  );
};
