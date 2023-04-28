export type Routes = '/token/holders';

type QueryParams = {
  '/token/holders': {
    limit: number;
    offset: number;
    tokenAddress: string;
  };
};

export type GetRouteQueryParams<T> = T extends keyof QueryParams
  ? QueryParams[T]
  : never;

export const buildRoute = <T extends Routes>(
  route: T,
  params: GetRouteQueryParams<T>
): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) =>
    searchParams.set(key, String(value))
  );

  const search = searchParams.toString();

  return `${route}${search ? `?${search}` : ''}`;
};
