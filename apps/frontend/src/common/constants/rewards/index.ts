import { Cluster, PublicKey } from "@solana/web3.js";
import { Faction, SwapSetting } from "~/types";

export const REWARD_TOKEN_MINT_PER_FACTION: Record<
  Lowercase<Faction>,
  PublicKey
> = {
  arco: new PublicKey("oniMqPYgTypbvTJqu8mL94pQM5QDdMF2fXcyweNJePQ"), //TODO
};

export const REWARD_TO_TOKEN_SWAP_STATE_ACCOUNTS: Record<
  Lowercase<Faction>,
  string
> = {
  arco: "J6cvRe9S7D6RtsKxLeQDYmRLdhAwCEw6jXCUCsLFEWmC", //TODO
};

type RewardsAccounts = {
  normal: Record<string, SwapSetting>;
};

type ClusterRewardsAccounts = Record<
  Exclude<Cluster, "testnet">,
  RewardsShipAccounts
>;

export const rewardsSwapTranslations: SwapSetting["sections"] = {
  intro: {
    title: "rewards.intro.title",
    description: "rewards.intro.description",
  },
  checkout: {
    title: "rewards.checkout.title",
    subtitle: "rewards.checkout.subtitle",
  },
  confirmed: {
    description: "rewards.checkout.confirmed.subtitle",
  },
};

export const rewardsShipAccounts: ClusterRewardsAccounts = {
  "mainnet-beta": {
    normal: {
      [REWARD_TO_TOKEN_SWAP_STATE_ACCOUNTS.arco]: {
        discounted: true,
        quantity: 1,
        mint: REWARD_TOKEN_MINT_PER_FACTION.arco,
        name: "Arco per reward",
        swapAccount: new PublicKey(REWARD_TO_TOKEN_SWAP_STATE_ACCOUNTS.arco), 
        vaultCurrency: "SAIRW1",  //TODO
        image: {
          normal: "/images/cards/card-arco.webp", //TODO
          square: "/images/cards/card-square-arco.webp",//TODO
        },
        sections: arcoSwapTranslations,
      },
    },
  }
};

export const isCitizenshipSwap = (state: string) =>
  Object.values({
    ...REWARD_TO_TOKEN_SWAP_STATE_ACCOUNTS,
  }).includes(state);
