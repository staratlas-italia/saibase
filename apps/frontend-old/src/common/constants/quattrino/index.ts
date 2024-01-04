import { mints } from '@saibase/constants';
import { Cluster } from '@solana/web3.js';
import { SwapSetting } from '../types';

export const QUATTRINO_TO_TOKEN_SWAP_STATE_ACCOUNTS = {
  s: 'quattrino-s',
  m: 'quattrino-m',
  l: 'quattrino-l',
} as const;

const introTranslations: Pick<SwapSetting['sections']['intro'], 'title'> = {
  title: 'quattrino.intro.title',
};

export const resourcesSwapTranslations: Omit<SwapSetting['sections'], 'intro'> =
  {
    checkout: {
      title: 'citizenship.checkout.title',
      subtitle: 'citizenship.checkout.subtitle',
    },
    confirmed: {
      description: 'citizenship.checkout.confirmed.subtitle',
    },
  };

type QuattrinoAccounts = {
  normal: Record<string, SwapSetting>;
};

type ClusterResourcesAccounts = Record<
  Exclude<Cluster, 'testnet'>,
  QuattrinoAccounts
>;

export const quattrinoAccounts: ClusterResourcesAccounts = {
  'mainnet-beta': {
    normal: {
      [QUATTRINO_TO_TOKEN_SWAP_STATE_ACCOUNTS.s]: {
        price: { type: 'package', value: 25 },
        prices: {
          real: 25,
          full: 30,
        },
        discounts: {
          discountRelativeToPreviousBundle: 0,
          preReleaseDiscount: 35,
        },
        quantity: 8000,
        mint: mints.quattrino,
        name: 'Quattrino Pack S',
        swapAccount: QUATTRINO_TO_TOKEN_SWAP_STATE_ACCOUNTS.s,
        vaultCurrency: 'USDC',
        image: {
          normal: '/images/resources/quattrino-coin.webp',
          square: '/images/resources/quattrino-coin-square.webp',
        },
        sections: {
          ...resourcesSwapTranslations,
          intro: {
            ...introTranslations,
            description: 'quattrino.intro.description',
          },
        },
      },
      [QUATTRINO_TO_TOKEN_SWAP_STATE_ACCOUNTS.m]: {
        price: { type: 'package', value: 45 },
        prices: {
          real: 45,
          full: 50,
        },
        discounts: {
          discountRelativeToPreviousBundle: 0,
          preReleaseDiscount: 35,
        },
        quantity: 16000,
        mint: mints.quattrino,
        name: 'Quattrino Pack M',
        swapAccount: QUATTRINO_TO_TOKEN_SWAP_STATE_ACCOUNTS.m,
        vaultCurrency: 'USDC',
        image: {
          normal: '/images/resources/quattrino-coin.webp',
          square: '/images/resources/quattrino-coin-square.webp',
        },
        sections: {
          ...resourcesSwapTranslations,
          intro: {
            ...introTranslations,
            description: 'quattrino.intro.description',
          },
        },
      },
      [QUATTRINO_TO_TOKEN_SWAP_STATE_ACCOUNTS.l]: {
        price: { type: 'package', value: 80 },
        prices: {
          real: 80,
          full: 100,
        },
        discounts: {
          discountRelativeToPreviousBundle: 0,
          preReleaseDiscount: 35,
        },
        quantity: 32000,
        mint: mints.quattrino,
        name: 'Quattrino Pack L',
        swapAccount: QUATTRINO_TO_TOKEN_SWAP_STATE_ACCOUNTS.l,
        vaultCurrency: 'USDC',
        image: {
          normal: '/images/resources/quattrino-coin.webp',
          square: '/images/resources/quattrino-coin-square.webp',
        },
        sections: {
          ...resourcesSwapTranslations,
          intro: {
            ...introTranslations,
            description: 'quattrino.intro.description',
          },
        },
      },
    },
  },
  devnet: {
    normal: {},
  },
};

export const isQuattrinoSwap = (state: string) =>
  (
    Object.values({
      ...QUATTRINO_TO_TOKEN_SWAP_STATE_ACCOUNTS,
    }) as string[]
  ).includes(state);
