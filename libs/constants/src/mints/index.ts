import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export const mints = {
  ammo: new PublicKey('ammoK8AkX2wnebQb35cDAZtTkvsXQbi82cGeTnUvvfK'),
  bSol: new PublicKey('bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1'),
  jitoSol: new PublicKey('J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn'),
  uxd: new PublicKey('7kbnvuGBxxj8AG9qp8Scn56muWGaRaFqxg1FsRp3PaFT'),
  atlas: new PublicKey('ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx'),
  bonk: new PublicKey('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'),
  ethWormhole: new PublicKey('7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs'),
  food: new PublicKey('foodQJAztMzX1DKpLaiounNe2BDMds5RNuPC6jsNrDG'),
  fuel: new PublicKey('fueL3hBZjLLLJHiFH9cqZoozTG3XQZ53diwFPwbzNim'),
  mSol: new PublicKey('mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So'),
  polis: new PublicKey('poLisWXnNRwC6oBu1vHiuKQzFjGL4XDSu4g9qjz9qVk'),
  ray: new PublicKey('4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R'),
  srm: new PublicKey('SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt'),
  stSol: new PublicKey('7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj'),
  tier1: new PublicKey('tr1HUaLpPmvaj1PAAXJokJ7PLjEGoSfuULhRvVvAPBS'),
  tier2: new PublicKey('tr2cweq4j6F8LrXk6vWWmamsxzkSFxyStCS3v1z2j75'),
  tier3: new PublicKey('tr3Z8EqLMeNf2gHSpCsu9uP2o5DzoQ8QNFmueKjHQ95'),
  toolkit: new PublicKey('tooLsNYLiVqzg8o4m3L2Uetbn62mvMWRqkog6PQeYKL'),
  usdc: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
  usdcWormhole: new PublicKey('A9mUU4qviSctJVPJdBJWkb28deg915LYJKrzQ19ji3FM'),
  usdcDevnet: new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'),
  usdt: new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'),
  wSol: new PublicKey('So11111111111111111111111111111111111111112'),
} as const;

export const mintsDecimals = {
  ammo: new BN(0),
  atlas: new BN(8),
  food: new BN(0),
  fuel: new BN(0),
  polis: new BN(8),
  tier1: new BN(0),
  tier2: new BN(0),
  tier3: new BN(0),
  toolkit: new BN(0),
  usdc: new BN(6),
  usdcDevnet: new BN(6),
} as const;
