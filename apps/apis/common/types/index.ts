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
