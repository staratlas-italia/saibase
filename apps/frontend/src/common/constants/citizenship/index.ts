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
}: {
  cluster: Cluster;
  faction: Faction;
  discounted?: boolean;
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
      ...getCitizenShipAccounts({ cluster: 'mainnet-beta', faction: 'ONI' }),
      ...getCitizenShipAccounts({ cluster: 'mainnet-beta', faction: 'MUD' }),
      ...getCitizenShipAccounts({ cluster: 'mainnet-beta', faction: 'USTUR' }),
    },
    discounted: {
      ...getCitizenShipAccounts({
        cluster: 'mainnet-beta',
        faction: 'ONI',
        discounted: true,
      }),
      ...getCitizenShipAccounts({
        cluster: 'mainnet-beta',
        faction: 'MUD',
        discounted: true,
      }),
      ...getCitizenShipAccounts({
        cluster: 'mainnet-beta',
        faction: 'USTUR',
        discounted: true,
      }),
    },
  },
  devnet: {
    normal: {
      ...getCitizenShipAccounts({ cluster: 'devnet', faction: 'ONI' }),
      ...getCitizenShipAccounts({ cluster: 'devnet', faction: 'MUD' }),
      ...getCitizenShipAccounts({ cluster: 'devnet', faction: 'USTUR' }),
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
