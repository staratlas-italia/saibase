import type { Faction } from '@saibase/star-atlas';
import { PublicKey } from '@solana/web3.js';

export const citizenship = {
  tokenMintPerFaction: {
    'mainnet-beta': {
      oni: new PublicKey('oniMqPYgTypbvTJqu8mL94pQM5QDdMF2fXcyweNJePQ'),
      mud: new PublicKey('mudS4YjsuhGAgoihdhT64762iGTYaqKZN92bwhcGAGr'),
      ustur: new PublicKey('ustuRPvoFHcmoonK7on8tc6MaUQeuzUxx2ioFeuXLyn'),
    },
    devnet: {
      oni: new PublicKey('FCNy7oyjevsCbHbL2cgDJeWrmd3wWTDeq4u4uafCNUuu'),
      mud: new PublicKey('EVWyAZNy32GnB9GZEcnGsawii4NfnC6KPsaRCGM7g8sx'),
      ustur: new PublicKey('7n4rgd4WVNvzFom7UFqjCa9fpMB9apP8Gz3zX3aS6VEr'),
    },
  } satisfies Record<
    'mainnet-beta' | 'devnet',
    Record<Lowercase<Faction>, PublicKey>
  >,
  factionToTokenSwapStateAccounts: {
    'mainnet-beta': {
      oni: new PublicKey('J6cvRe9S7D6RtsKxLeQDYmRLdhAwCEw6jXCUCsLFEWmC'),
      mud: new PublicKey('3CKAvF1v9hCXzZHPG68CMPtTuuX7gAE1dmvW6xBdnVNH'),
      ustur: new PublicKey('AKPxHQyA7rzPwcfx8udQjisaWm45qopMoji8cC8tiMBJ'),
    },
    devnet: {
      oni: new PublicKey('BtpXkPQoAc2eeoFoSmjqJxssM2GUcLScbEJQr3ACvDT9'),
      mud: new PublicKey('FQpDeHQZ4csh7dkyYGFPDq4mvW6KZH4uTBxohxPG3K8b'),
      ustur: new PublicKey('2w1DbkC4XcreYJquUz2vz2uhV9pKaik4j6w11uWjFUso'),
    },
  } satisfies Record<
    'mainnet-beta' | 'devnet',
    Record<Lowercase<Faction>, PublicKey>
  >,
  factionToTokenSwapStateAccountsDiscounted: {
    'mainnet-beta': {
      oni: new PublicKey('D9Nq8DSbTvDWTHnG9jEgkcoLKmfTaGds6UgdE9c1Y4hz'),
      mud: new PublicKey('BXkoZquRBwbscxLit57CQCJGa9LwE2TByQpvSp9afhFe'),
      ustur: new PublicKey('9Pb1mbD6tkxsRPauNZPZ5fta7TUMPjN6ZXpujTjkQNko'),
    },
    devnet: {
      oni: new PublicKey('D9Nq8DSbTvDWTHnG9jEgkcoLKmfTaGds6UgdE9c1Y4hz'),
      mud: new PublicKey('BXkoZquRBwbscxLit57CQCJGa9LwE2TByQpvSp9afhFe'),
      ustur: new PublicKey('9Pb1mbD6tkxsRPauNZPZ5fta7TUMPjN6ZXpujTjkQNko'),
    },
  } satisfies Record<
    'mainnet-beta' | 'devnet',
    Record<Lowercase<Faction>, PublicKey>
  >,
} as const;
