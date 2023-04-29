import { StarAtlasNft } from '@saibase/star-atlas';
import { useEffect } from 'react';
import useSWR from 'swr';
import { useShipContext } from '~/contexts/ShipsContext';
import { api } from '~/network/api';
import { getApiRoute } from '~/utils/getRoute';

const fetcher = (url: string) => api.get<StarAtlasNft[]>(url);

export const useNullableShips = () => {
  const { update } = useShipContext();

  const { data, error } = useSWR<StarAtlasNft[] | undefined>(
    getApiRoute('/api/ships'),
    fetcher
  );

  useEffect(() => {
    if (data?.length) {
      update(data);
    }
  }, [data]);

  return {
    data,
    error,
    loading: !data && !error,
  };
};
