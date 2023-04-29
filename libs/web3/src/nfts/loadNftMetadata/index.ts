import { Cluster, Metadata, Metaplex, Nft, Sft } from '@metaplex-foundation/js';
import { createError } from '@saibase/errors';
import { Connection } from '@solana/web3.js';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';

type Param = {
  connection: Connection;
  cluster?: Cluster;
  metaplex?: Metaplex;
  nft: Nft | Sft | Metadata | null;
  signal?: AbortSignal;
};

export const loadNftMetadata = ({
  connection,
  cluster = 'mainnet-beta',
  metaplex = Metaplex.make(connection, { cluster }),
  nft,
  signal = AbortSignal.timeout(5000),
}: Param) =>
  pipe(
    O.fromNullable(nft),
    TE.fromOption(() =>
      createError('NftNotExistsError')('Cannot load this nft.')
    ),
    TE.chainW((nft) =>
      nft.model === 'metadata'
        ? TE.tryCatch(
            () => metaplex.nfts().load({ metadata: nft }, { signal }),
            createError('NftLoadError')
          )
        : TE.right(nft)
    )
  );
