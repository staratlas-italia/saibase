import { PropsWithChildren } from 'react';
import { useNullableShips } from '../../hooks/useNullableShips';
import { LoadingView } from '../LoadingView';

export const ShipsRetriever = ({ children }: PropsWithChildren) => {
  const { error, loading } = useNullableShips();

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return null;
  }

  return children;
};
