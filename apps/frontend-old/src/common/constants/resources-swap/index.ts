import { Cluster, PublicKey } from '@solana/web3.js';
import { SwapSetting } from '../../../types';

type Resources = 'arco' /*| 'diamond'*/;

export const SWAP_TOKEN_MINT_PER_RESOURCE: Record<Resources, PublicKey> = {
  // TODO:real public key of arco
  arco: new PublicKey('AhTiHuk9LgFtQotsHZ54rtKpBTvn7kje3ZnPJrDqERyn'),
  //diamond: new PublicKey('AKJyRrft4RWB9o9Rd1KdWmCwKapZQ8XvNMfyPtqL45u5'),
};

export const DEVNET_SWAP_TOKEN_MINT_PER_RESOURCE: Record<Resources, PublicKey> =
  {
    arco: new PublicKey('AhTiHuk9LgFtQotsHZ54rtKpBTvn7kje3ZnPJrDqERyn'),
    //diamond: new PublicKey('AKJyRrft4RWB9o9Rd1KdWmCwKapZQ8XvNMfyPtqL45u5'),
  };

export const RESOURCES_TO_TOKEN_SWAP_STATE_ACCOUNTS: Record<Resources, string> =
  {
    arco: '6Sy3KdFyZhkiAmBsC8ZfJna6eVM97MTaTZyBX9NnCCJR',
    //diamond: '9gRJncna1A1n1ZSbLorknwUPRgbHPmpcBPAYRKHwpxQU',
  };

export const DEVNET_RESOURCES_TO_TOKEN_SWAP_STATE_ACCOUNTS: Record<
  Resources,
  string
> = {
  arco: '6Sy3KdFyZhkiAmBsC8ZfJna6eVM97MTaTZyBX9NnCCJR',
  //diamond: 'BGkzA24K1f8Sp9jxZRXT7Kdu9QMSNUw5tUiiuiro1KwS',
};

const introTranslations: Pick<SwapSetting['sections']['intro'], 'title'> = {
  title: 'resource.intro.title',
};

export const resourcesSwapTranslations: Omit<SwapSetting['sections'], 'intro'> =
  {
    checkout: {
      title: 'resource.checkout.title',
      subtitle: 'resource.checkout.subtitle',
    },
    confirmed: {
      description: 'resource.checkout.confirmed.subtitle',
    },
  };

type ResourcesAccounts = {
  normal: Record<string, SwapSetting>;
};

type ClusterResourcesAccounts = Record<
  Exclude<Cluster, 'testnet'>,
  ResourcesAccounts
>;

export const resourceAccounts: ClusterResourcesAccounts = {
  'mainnet-beta': {
    normal: {},
  },
  devnet: {
    normal: {
      [DEVNET_RESOURCES_TO_TOKEN_SWAP_STATE_ACCOUNTS.arco]: {
        quantity: { type: 'user-defined' },
        mint: DEVNET_SWAP_TOKEN_MINT_PER_RESOURCE.arco,
        name: 'Arco - Devnet',
        swapAccount: new PublicKey(
          DEVNET_RESOURCES_TO_TOKEN_SWAP_STATE_ACCOUNTS.arco
        ),
        vaultCurrency: 'USDC-Dev',
        image: {
          normal: '/images/cards/card-tutor-s.webp',
          square: '/images/cards/card-tutor-s-square.webp',
        },
        sections: {
          ...resourcesSwapTranslations,
          intro: {
            ...introTranslations,
            description: 'tutor.intro.description.s',
          },
        },
      },
    },
  },
};

export const clusterSwitch = <T>(cluster: Cluster, devnet: T, mainnet: T) => {
  return cluster === 'devnet' ? devnet : mainnet;
};

export const isResourcesSwap = (state: string) =>
  Object.values({
    ...DEVNET_RESOURCES_TO_TOKEN_SWAP_STATE_ACCOUNTS,
    ...RESOURCES_TO_TOKEN_SWAP_STATE_ACCOUNTS,
  }).includes(state);
