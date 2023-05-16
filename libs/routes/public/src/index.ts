export type PublicRoute =
  | '/'
  | '/admin'
  | '/citizenship'
  | '/dashboard'
  | '/mint'
  | '/ships'
  | '/ships/:shipId'
  | '/ships/deals'
  | '/swap/:swapAccount'
  | '/swap/:swapAccount/checkout'
  | '/swap/:swapAccount/checkout/confirmed'
  | '/swap/:swapAccount/checkout/error'
  | '/institutional';

export const getPublicRoute = <Route extends PublicRoute>(route: Route) =>
  route;
