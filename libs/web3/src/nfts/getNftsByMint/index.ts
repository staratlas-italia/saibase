import { Metaplex } from '@metaplex-foundation/js';
import { createError } from '@saibase/errors';
import { Cluster, Connection, PublicKey } from '@solana/web3.js';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';

type Param = {
  cluster?: Cluster;
  connection: Connection;
  metaplex?: Metaplex;
  mintAddress: PublicKey;
  signal?: AbortSignal;
};

export const getNftsByMint = ({
  connection,
  cluster = 'mainnet-beta',
  mintAddress,
  metaplex = Metaplex.make(connection, { cluster }),
  signal = new AbortController().signal,
}: Param) =>
  pipe(
    TE.tryCatch(
      () =>
        metaplex.nfts().findByMint(
          {
            mintAddress,
          },
          { signal }
        ),
      createError('NftFetchByMintError')
    )
  );
