import { Metaplex } from '@metaplex-foundation/js';
import { createError } from '@saibase/errors';
import { Cluster, Connection, PublicKey } from '@solana/web3.js';
import * as TE from 'fp-ts/TaskEither';

type Param = {
  address: PublicKey;
  cluster?: Cluster;
  connection: Connection;
  metaplex?: Metaplex;
  signal?: AbortSignal;
};

export const getTokenWithMintByAddress = ({
  address,
  connection,
  cluster = 'mainnet-beta',
  metaplex = Metaplex.make(connection, { cluster }),
  signal = new AbortController().signal,
}: Param) =>
  TE.tryCatch(
    () =>
      metaplex.tokens().findTokenWithMintByAddress(
        {
          address,
        },
        { signal }
      ),
    createError('TokenWithMintFetchError')
  );
