import { citizenship } from '@saibase/sai-citizenship';
import { Faction } from '@saibase/star-atlas';
import { Cluster } from '@solana/web3.js';
import { SwapSetting } from '../types';

type CitizenShipAccounts = {
  discounted: Record<string, SwapSetting>;
  normal: Record<string, SwapSetting>;
};

type ClusterCitizenShipAccounts = Record<
  Exclude<Cluster, 'testnet'>,
  CitizenShipAccounts
>;

export const citizenshipSwapTranslations: SwapSetting['sections'] = {
  intro: {
    title: 'citizenship.intro.title',
    description: 'citizenship.intro.description',
  },
  checkout: {
    title: 'citizenship.checkout.title',
    subtitle: 'citizenship.checkout.subtitle',
  },
  confirmed: {
    description: 'citizenship.checkout.confirmed.subtitle',
  },
};

const getCitizenShipAccounts = ({
  cluster,
  faction,
  discounted,
  price,
}: {
  cluster: Cluster;
  faction: Faction;
  discounted?: boolean;
  price: number;
}) => {
  if (cluster === 'testnet') {
    return {};
  }

  const factionAccounts = (
    discounted
      ? citizenship.factionToTokenSwapStateAccountsDiscounted
      : citizenship.factionToTokenSwapStateAccounts
  )[cluster];

  const lowercaseFaction = faction.toLowerCase() as Lowercase<Faction>;

  return {
    [factionAccounts[lowercaseFaction].toString()]: {
      discounted: true,
      quantity: 1,
      price: { type: 'unit' as const, value: price },
      mint: citizenship.tokenMintPerFaction[cluster][lowercaseFaction],
      name: `Badge ${faction}${discounted ? ' discounted' : ''}`,
      swapAccount: factionAccounts[lowercaseFaction],
      vaultCurrency: cluster === 'devnet' ? 'USDC-Dev' : 'USDC',
      image: {
        normal: `/images/cards/card-${lowercaseFaction}.webp`,
        square: `/images/cards/card-square-${lowercaseFaction}.webp`,
      },
      sections: citizenshipSwapTranslations,
    },
  };
};

export const citizenShipAccounts: ClusterCitizenShipAccounts = {
  'mainnet-beta': {
    normal: {
      ...getCitizenShipAccounts({
        cluster: 'mainnet-beta',
        faction: 'ONI',
        price: 20,
      }),
      ...getCitizenShipAccounts({
        cluster: 'mainnet-beta',
        faction: 'MUD',
        price: 20,
      }),
      ...getCitizenShipAccounts({
        cluster: 'mainnet-beta',
        faction: 'USTUR',
        price: 20,
      }),
    },
    discounted: {
      ...getCitizenShipAccounts({
        cluster: 'mainnet-beta',
        faction: 'ONI',
        discounted: true,
        price: 15,
      }),
      ...getCitizenShipAccounts({
        cluster: 'mainnet-beta',
        faction: 'MUD',
        discounted: true,
        price: 15,
      }),
      ...getCitizenShipAccounts({
        cluster: 'mainnet-beta',
        faction: 'USTUR',
        discounted: true,
        price: 15,
      }),
    },
  },
  devnet: {
    normal: {
      ...getCitizenShipAccounts({
        cluster: 'devnet',
        faction: 'ONI',
        price: 15,
      }),
      ...getCitizenShipAccounts({
        cluster: 'devnet',
        faction: 'MUD',
        price: 15,
      }),
      ...getCitizenShipAccounts({
        cluster: 'devnet',
        faction: 'USTUR',
        price: 15,
      }),
    },
    discounted: {},
  },
};

export const isCitizenshipSwap = (state: string) =>
  Object.values({
    ...citizenship.factionToTokenSwapStateAccounts['mainnet-beta'],
    ...citizenship.factionToTokenSwapStateAccounts['devnet'],
    ...citizenship.factionToTokenSwapStateAccountsDiscounted['mainnet-beta'],
    ...citizenship.factionToTokenSwapStateAccountsDiscounted['devnet'],
  })
    .map((p) => p.toString())
    .includes(state);
