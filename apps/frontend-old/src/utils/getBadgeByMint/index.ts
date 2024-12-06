import { PublicKey } from '@solana/web3.js';
import { values } from 'lodash';

import { citizenship } from '@saibase/sai-citizenship';
import { tier1BadgeMints } from './tier1';
import { tier2BadgeMints } from './tier2';
import { tier3BadgeMints } from './tier3';

export const allGenesisBadgeMints = [
  ...tier1BadgeMints,
  ...tier2BadgeMints,
  ...tier3BadgeMints,
];

export const getBadgeByMint = (badgeMint: PublicKey) => {
  if (tier1BadgeMints.includes(badgeMint.toString())) {
    return 'tier1';
  }

  if (tier2BadgeMints.includes(badgeMint.toString())) {
    return 'tier2';
  }

  if (tier3BadgeMints.includes(badgeMint.toString())) {
    return 'tier3';
  }

  if (
    values(citizenship.tokenMintPerFaction['mainnet-beta'])
      .map((s) => s.toString())
      .includes(badgeMint.toString())
  ) {
    return 'citizenship';
  }

  return null;
};
