import { citizenship } from '@saibase/constants';

export const getHueByFactionStyle = (badgeMint: string) => {
  switch (badgeMint) {
    case citizenship.tokenMintPerFaction['mainnet-beta'].mud.toString():
      return 140;
    case citizenship.tokenMintPerFaction['mainnet-beta'].oni.toString():
      return 40;
    case citizenship.tokenMintPerFaction['mainnet-beta'].ustur.toString():
      return 200;
    default:
      return 0;
  }
};
