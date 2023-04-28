import { Metaplex } from '@metaplex-foundation/js';
import { createError } from '@saibase/errors';
import { Cluster, Connection, PublicKey } from '@solana/web3.js';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { loadNftMetadata } from '../loadNftMetadata';

type Param = {
  connection: Connection;
  cluster?: Cluster;
  metaplex?: Metaplex;
  owner: PublicKey;
  signal?: AbortSignal;
};

export const getNftsByOwner = ({
  connection,
  cluster = 'mainnet-beta',
  metaplex = Metaplex.make(connection, { cluster }),
  owner,
  signal = new AbortController().signal,
}: Param) =>
  pipe(
    TE.tryCatch(
      () =>
        metaplex.nfts().findAllByOwner(
          {
            owner,
          },
          { signal }
        ),
      createError('NftFetchByOwnerError')
    ),
    TE.chainW(
      TE.traverseArray((nft) =>
        loadNftMetadata({ connection, metaplex, nft, signal })
      )
    )
  );
