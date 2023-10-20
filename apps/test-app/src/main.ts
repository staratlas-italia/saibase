// import { rpcApiBaseUrl } from '@saibase/configuration';
// import { getAllTokenHolders, TokenInfo } from '@saibase/web3';
// import { Connection, PublicKey } from '@solana/web3.js';
// import { pipe } from 'fp-ts/lib/function';
// import * as T from 'fp-ts/Task';
// import * as TE from 'fp-ts/TaskEither';
// import { writeFileSync } from 'fs';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import fs from 'fs';
import genesis from './genesis.json';
import { tier1BadgeMints } from './tier1';
import { tier2BadgeMints } from './tier2';
import { tier3BadgeMints } from './tier3';

// const run = async () => {
//   const connection = new Connection(rpcApiBaseUrl);

//   const allGenesisBadgeMints = [
//     ...tier1BadgeMints,
//     ...tier2BadgeMints,
//     ...tier3BadgeMints,
//   ];

//   let holders: TokenInfo[] = [];

//   for (const mint of allGenesisBadgeMints) {
//     const mintHolders = await pipe(
//       getAllTokenHolders({ connection, mint: new PublicKey(mint) }),
//       TE.chainFirstIOK(
//         (a) => () => console.log(`Found ${a.length} holders for token ${mint}`)
//       ),
//       TE.getOrElse(() => T.of([] as TokenInfo[])),
//       T.delay(1000)
//     )();

//     holders = holders.concat(mintHolders);
//   }

//   writeFileSync('genesis.json', JSON.stringify(holders, null, 2));
// };

const run = () => {
  const genesis2 = pipe(
    genesis,
    RNEA.groupBy((item) => item.owner),
    R.map((item) => {
      return {
        ...item[0],
        owner: item[0].owner,
        tokenAmount: {
          uiAmount: item.reduce(
            (acc, curr) => acc + curr.tokenAmount.uiAmount,
            0
          ),
        },
      };
    }),
    R.toArray
  );

  genesis2.forEach(([, holder]) => {
    if (holder.tokenAmount.uiAmount === 0) {
      return;
    }

    const isTier1 = tier1BadgeMints.includes(holder.mint);
    const isTier2 = tier2BadgeMints.includes(holder.mint);
    const isTier3 = tier3BadgeMints.includes(holder.mint);

    const tier = isTier1 ? 'S' : isTier2 ? 'M' : isTier3 ? 'L' : 'None';

    fs.appendFileSync(
      'holders.csv',
      holder.owner + ',' + holder.tokenAmount.uiAmount + ',' + tier + '\n'
    );
  });
};

run();
