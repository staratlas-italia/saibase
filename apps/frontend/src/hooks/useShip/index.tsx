import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useShips } from "../useShips";

export const useShip = () => {
  const {
    query: { id },
  } = useRouter();

  const { ships } = useShips();

  const ship = useMemo(() => ships?.find((s) => s._id === id), [id, ships]);

  const saleIsNotBegin = useMemo(() => {
    if (!ship) return null;
    const now = Math.floor(Date.now() / 1000);
    return ship?.primarySales?.some((sale) => now < sale.listTimestamp);
  }, [ship]);

  const saleDate = useMemo(() => {
    if (!ship) return null;
    const saleTimestamps = ship?.primarySales?.map(
      (sale) => sale.listTimestamp
    );
    if (!saleTimestamps) return null;

    const timestamp = Math.min(...saleTimestamps);

    return new Date(timestamp * 1000);
  }, [ship]);

  return {
    ...ship,
    saleIsNotBegin,
    saleDate,
  };
};
