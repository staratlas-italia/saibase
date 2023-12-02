export type Fleet = {
  publicKey?: string;
  fleet: string;
  name: string;
  description?: string;
  scope: string;
  goal: string;
  lp: number;
  deks?: string[];
};

export type User = {
  publicKey: string;
  currentNonce: string;
  premium: boolean;
};

export const sageScopes = new Set(['Sage', 'Score']);

export const sageGoals = new Set([
  'Mining',
  'Crafting',
  'Freight',
  'Scanning',
  'Resources',
  'Atlas',
]);

export type BestPrices = {
  avgPrice: number;
  bestAskPrice: number;
  bestBidPrice: number;
};

export type Currency = 'ATLAS' | 'POLIS' | 'USDC' | 'NONE';

export interface DataPrices {
  [key: string]: BestPrices;
}
