import { getApiRoute } from '@saibase/routes-api';
import { StarAtlasNft } from '@saibase/star-atlas';
import { useEffect } from 'react';
import useSWR from 'swr';
import { useShipContext } from '../../contexts/ShipsContext';

const fetcher = (url: string): Promise<StarAtlasNft[]> =>
  fetch(url).then((resp) => resp.json());

export const useNullableShips = () => {
  const { update } = useShipContext();

  const { data, error } = useSWR(getApiRoute('/api/ships'), fetcher);

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
