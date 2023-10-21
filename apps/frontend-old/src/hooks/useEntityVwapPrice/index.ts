import { useMemo } from "react";
import { useShip } from "../useShip";
import { getEntityVwapPrice } from "../../utils/getEntityVwapPrice";

export const useEntityVwapPrice = () => {
  const { primarySales } = useShip();

  const vwap = useMemo(() => {
    return getEntityVwapPrice(primarySales || []);
  }, [primarySales]);

  return vwap;
};
