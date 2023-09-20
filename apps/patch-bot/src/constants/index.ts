import { GrowthBook } from '@growthbook/growthbook';
import { environment, rpcApiBaseUrl } from '@saibase/configuration';
import { Faction } from '@saibase/star-atlas';
import { Connection, PublicKey } from '@solana/web3.js';
import { roleIds } from './roles';

export const TUTOR_SWAP_TOKEN_MINT = new PublicKey(
  'saigxN5oNN2VPdMfoUqzVhHtKwBfXJZGa95Uc7dtqDZ'
);

export const citizenshipMints: Record<Lowercase<Faction>, PublicKey> = {
  oni: new PublicKey('oniMqPYgTypbvTJqu8mL94pQM5QDdMF2fXcyweNJePQ'),
  mud: new PublicKey('mudS4YjsuhGAgoihdhT64762iGTYaqKZN92bwhcGAGr'),
  ustur: new PublicKey('ustuRPvoFHcmoonK7on8tc6MaUQeuzUxx2ioFeuXLyn'),
};

export const BADGES_MINT_ROLES = [
  ...(['oni', 'mud', 'ustur'] as const).map(
    (faction) =>
      [citizenshipMints[faction], roleIds.citizenship[faction]] as const
  ),
  [TUTOR_SWAP_TOKEN_MINT, roleIds.tutor] as const,
];

export const developersChannel = environment.production
  ? '925752444011548772'
  : '968260211125137428';

export const featuresEndpoint = process.env.FEATURES_ENDPOINT;

export const discordBotToken = process.env.DISCORD_BOT_TOKEN;

export const growthbook = new GrowthBook();

export const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
);

export const guildWallets = [
  /* Oni */
  'kyaAizoPq8AGNhVFQNdm6761dmsF2hWibD2a2xt8tbG',
  /* Ustur */
  'HRgg616m2vGT1amuAbySNCCAYfBD264tchQYUJHn8cfN',
  /* Mud */
  'CnX7FQ2nRpLdsYJG6LLYHUrDQEZ35vPjyy2dV82GLhit',
  /* DAO */
  'F98uoxm7QG1nyvArNfbfVM9du8c6n41YMuyRG6Tp54xD',
];

export const connection = new Connection(rpcApiBaseUrl);
