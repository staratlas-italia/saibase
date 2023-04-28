import { ExtractErrors } from '@saibase/errors';
import { StarAtlasNftArray } from '@saibase/star-atlas';
import { Nft, NftWithToken, Sft, SftWithToken } from '@saibase/web3';
import { atom } from 'jotai';
import { customGetNftByOwner } from '../../pages';

export const fetchNftsErrorAtom = atom<
  ExtractErrors<typeof customGetNftByOwner> | false
>(false);

export const nftsAtom = atom<
  ReadonlyArray<Nft | Sft | NftWithToken | SftWithToken> | false
>(false);

export const saNftsAtom = atom<StarAtlasNftArray>([]);
