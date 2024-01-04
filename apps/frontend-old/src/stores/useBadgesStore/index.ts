import { Nft, NftWithToken, Sft, SftWithToken } from '@metaplex-foundation/js';
import { citizenship } from '@saibase/sai-citizenship';
import { fetchNfts } from '@saibase/star-atlas';
import {
  getAllNftsByMintList,
  getNftsByOwner,
  getTokenWithMintByAddress,
} from '@saibase/web3';
import { captureException } from '@sentry/nextjs';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import { Eq } from 'fp-ts/Eq';
import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { create } from 'zustand';
import { TUTOR_SWAP_TOKEN_MINT } from '../../common/constants/tutor';
import { getBadgeByMint } from '../../utils/getBadgeByMint';

type BadgesStore = {
  badges: readonly (Nft | Sft | NftWithToken | SftWithToken)[] | null;
  isFetching: boolean;
  clear: () => void;
  fetchBadges: (connection: Connection, publicKey: PublicKey) => void;
};

const NftEq: Eq<Nft | Sft | NftWithToken | SftWithToken> = {
  equals: (a, b) => a.mint.address.equals(b.mint.address),
};

const fetchSfts = ({
  connection,
  publicKey,
  mints,
}: {
  connection: Connection;
  publicKey: PublicKey;
  mints: PublicKey[];
}) =>
  pipe(
    mints,
    A.map((mint) => getAssociatedTokenAddressSync(mint, publicKey)),
    (addresses) => TE.rightIO(() => addresses),
    TE.chainW(
      TE.traverseArray((address) =>
        pipe(
          getTokenWithMintByAddress({ connection, address }),
          TE.map(O.some),
          TE.orElseW(() => TE.right(O.none))
        )
      )
    ),
    TE.map(A.compact),
    TE.map(A.map((token) => token.mint.address.toString())),
    TE.chainW((mintAddresses) =>
      pipe(
        getAllNftsByMintList({ connection, mints }),
        TE.map(
          A.filter((sft) => mintAddresses.includes(sft.mint.address.toString()))
        )
      )
    )
  );

export const useBadgesStore = create<BadgesStore>((set, get) => ({
  badges: null,
  isFetching: false,
  fetchBadges: async (connection, publicKey) => {
    if (get().badges || get().isFetching) {
      return;
    }

    set({ isFetching: true });

    const starAtlasBadgesMints = await pipe(
      fetchNfts(),
      TE.map((response) =>
        pipe(
          response.data,
          A.filter((nft) => nft.attributes.class === 'badge'),
          A.map((nft) => nft.mint)
        )
      ),
      TE.getOrElse(() => T.of([] as readonly string[]))
    )();

    const mints = [
      citizenship.tokenMintPerFaction['mainnet-beta'].oni,
      citizenship.tokenMintPerFaction['mainnet-beta'].mud,
      citizenship.tokenMintPerFaction['mainnet-beta'].ustur,
      TUTOR_SWAP_TOKEN_MINT,
    ];

    pipe(
      TE.Do,
      TE.bind('nfts', () => getNftsByOwner({ connection, owner: publicKey })),
      TE.bindW('sfts', () => fetchSfts({ connection, mints, publicKey })),
      TE.map(({ nfts, sfts }) => A.fromArray([...nfts, ...sfts])),
      TE.map(A.uniq(NftEq)),
      TE.map(
        A.filter(
          (nftOrSft) =>
            !!getBadgeByMint(nftOrSft.mint.address) ||
            starAtlasBadgesMints.includes(nftOrSft.mint.address.toString())
        )
      ),
      TE.chainIOK(
        (nftsOfSfts) => () =>
          set({
            badges: nftsOfSfts,
            isFetching: false,
          })
      ),
      TE.orElseFirstIOK((error) => () => {
        captureException(error);

        set({
          badges: [],
          isFetching: false,
        });
      })
    )();
  },
  clear: () => set({ badges: null }),
}));

const citizenshipSelector = (state: BadgesStore) =>
  state.badges?.filter((badge) =>
    Object.values(citizenship.tokenMintPerFaction['mainnet-beta'])
      .map((p) => p.toString())
      .includes(badge.mint.address.toString())
  );

const tutorSelector = (state: BadgesStore) =>
  state.badges?.find((badge) =>
    badge.mint.address.equals(TUTOR_SWAP_TOKEN_MINT)
  );

export const useCitizenshipBadges = () => useBadgesStore(citizenshipSelector);
export const useTutorBadge = () => useBadgesStore(tutorSelector);
