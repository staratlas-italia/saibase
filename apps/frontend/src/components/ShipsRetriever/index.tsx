import { PropsWithChildren } from 'react';
import { LoadingView } from "../LoadingView";
import { useNullableShips } from "../../hooks/useNullableShips";

export const ShipsRetriever = ({ children }: PropsWithChildren) => {
  const { error, loading } = useNullableShips();

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return null;
  }

  return <>{children}</>;
};
