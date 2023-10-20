import { getEntityVwapPrice } from '@saibase/star-atlas';
import { useMemo } from 'react';
import { useShip } from "../useShip";

export const useEntityVwapPrice = () => {
  const { primarySales } = useShip();

  const vwap = useMemo(
    () => getEntityVwapPrice(primarySales || []),
    [primarySales]
  );

  return vwap;
};
