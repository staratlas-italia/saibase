import { NftPrimarySale } from '@saibase/star-atlas';

export const getEntityVwapPrice = (sales: NftPrimarySale[]) => {
  let totalEntities = 0;

  const totalRevenue =
    sales?.reduce((result, item) => {
      totalEntities += item.supply ?? 0;
      result += (item.price ?? 0) * (item.supply ?? 0);

      return result;
    }, 0) || 0;

  return totalRevenue / totalEntities;
};
