import { Metaplex } from '@metaplex-foundation/js';
import { createError } from '@saibase/errors';
import { Cluster, Connection, PublicKey } from '@solana/web3.js';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { loadNftMetadata } from '../loadNftMetadata';

type Param = {
  cluster?: Cluster;
  connection: Connection;
  metaplex?: Metaplex;
  mints: PublicKey[];
  signal?: AbortSignal;
};

export const getAllNftsByMintList = ({
  connection,
  cluster = 'mainnet-beta',
  metaplex = Metaplex.make(connection, { cluster }),
  mints,
  signal = new AbortController().signal,
}: Param) =>
  pipe(
    TE.tryCatch(
      () =>
        metaplex.nfts().findAllByMintList(
          {
            mints,
          },
          { signal }
        ),
      createError('NftFetchAllByMintListError')
    ),
    TE.chainW(
      TE.traverseArray((nft) =>
        loadNftMetadata({ connection, metaplex, nft, signal })
      )
    )
  );
