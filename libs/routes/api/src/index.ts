export type ApiRoutes =
  | '/api/kittens'
  | '/api/menu'
  | '/api/payment/confirm'
  | '/api/payment/reference'
  | '/api/player'
  | '/api/referral/create'
  | '/api/referral/redeem'
  | '/api/score/:publicKey'
  | '/api/score/rates/:mint'
  | '/api/self'
  | '/api/self/link'
  | '/api/ships'
  | '/api/swap';

export const getApiRoute = <Route extends ApiRoutes>(route: Route) => route;
