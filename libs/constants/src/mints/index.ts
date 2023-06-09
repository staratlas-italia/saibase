import { PublicKey } from '@solana/web3.js';

export const mints = {
  ammo: new PublicKey('ammoK8AkX2wnebQb35cDAZtTkvsXQbi82cGeTnUvvfK'),
  atlas: new PublicKey('ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx'),
  food: new PublicKey('foodQJAztMzX1DKpLaiounNe2BDMds5RNuPC6jsNrDG'),
  fuel: new PublicKey('fueL3hBZjLLLJHiFH9cqZoozTG3XQZ53diwFPwbzNim'),
  polis: new PublicKey('poLisWXnNRwC6oBu1vHiuKQzFjGL4XDSu4g9qjz9qVk'),
  tier1: new PublicKey('tr1HUaLpPmvaj1PAAXJokJ7PLjEGoSfuULhRvVvAPBS'),
  tier2: new PublicKey('tr2cweq4j6F8LrXk6vWWmamsxzkSFxyStCS3v1z2j75'),
  tier3: new PublicKey('tr3Z8EqLMeNf2gHSpCsu9uP2o5DzoQ8QNFmueKjHQ95'),
  toolkit: new PublicKey('tooLsNYLiVqzg8o4m3L2Uetbn62mvMWRqkog6PQeYKL'),
  usdc: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
  usdcDevnet: new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'),
} as const;
