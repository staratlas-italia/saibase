import { citizenship } from '@saibase/sai-citizenship';
import { PublicKey } from '@solana/web3.js';

export const isFactionBadge = (badgeMint: PublicKey) => {
  if (
    Object.values(citizenship.tokenMintPerFaction['mainnet-beta'])
      .map((s) => s.toString())
      .includes(badgeMint.toString())
  ) {
    return true;
  }

  return false;
};
