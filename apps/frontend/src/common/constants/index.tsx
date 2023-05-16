import { GrowthBook } from '@growthbook/growthbook-react';
import { PublicKey } from '@solana/web3.js';
import { GmClientService } from '@staratlas/factory';
import { citizenShipAccounts } from 'apps/frontend/src/common/constants/citizenship';
import { tutorAccounts } from '~/common/constants/tutor';
import { SwapSetting } from './types';

export const DISCORD_API_URL = 'https://discord.com/api';

export const DISCORD_OAUTH_URL = process.env.DISCORD_OAUTH_URL;

export const FUEL_PRICE = 0.00144336;

export const FOOD_PRICE = 0.0006144;

export const ARMS_PRICE = 0.00215039;

export const TOOLKIT_PRICE = 0.0017408;

export const ATLAS_DECIMAL = 100_000_000;

export const ONE_DAY_IN_MILLISECONDS = 86_400_000;

export const APP_BASE_URL = process.env.APP_BASE_URL || '';

export const FLEET_WEBSITE_URL = 'https://fleet.staratlasitalia.com';

export const DEV_EMAIL = 'dev@staratlasitalia.com';

export const growthbook = new GrowthBook();

export const gmClientService = new GmClientService();

export const FEATURES_ENDPOINT =
  process.env.ENVIRONMENT === 'production'
    ? process.env.FEATURES_ENDPOINT
    : process.env.DEV_FEATURES_ENDPOINT;

export const SAI_TOKEN_SWAP_PROGRAM_ID = new PublicKey(
  '9EwZquhRwZ7efbMwATpt5XRJsbXKFjQ2aFfePyL2ngFg'
);

export const MEMO_PROGRAM_ID = new PublicKey(
  'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'
);

export const TOKEN_SWAP_STATE_ACCOUNTS: Record<string, SwapSetting> = {
  ...citizenShipAccounts['mainnet-beta'].normal,
  ...citizenShipAccounts['mainnet-beta'].discounted,
  ...tutorAccounts['mainnet-beta'].normal,
};

export const DEVNET_TOKEN_SWAP_STATE_ACCOUNTS: Record<string, SwapSetting> = {
  ...citizenShipAccounts['devnet'].normal,
  ...citizenShipAccounts['devnet'].discounted,
  ...tutorAccounts['devnet'].normal,
};
