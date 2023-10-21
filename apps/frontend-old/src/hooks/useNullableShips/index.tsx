import { getApiRoute } from '@saibase/routes-api';
import { fetchNfts } from '@saibase/star-atlas';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { useEffect } from 'react';
import useSWR from 'swr';
import { useShipContext } from '../../contexts/ShipsContext';
import { promiseFromTaskEither } from '../../utils/promiseFromTaskEither';

const fetcher = () =>
  pipe(
    fetchNfts(),
    TE.map((resp) => resp.data),
    promiseFromTaskEither
  );

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
