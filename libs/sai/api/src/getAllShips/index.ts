import { Err } from '@contactlab/appy';
import {
  StarAtlasNft,
  StarAtlasNftArray,
  fetchNfts,
} from '@saibase/star-atlas';
import * as A from 'fp-ts/Array';
import { Ord } from 'fp-ts/Ord';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { withBody} from '@saibase/fetch';

const shipSizes: Record<string, number> = {
  mini: -2,
  'xxx-small': -1,
  'xx-small': 0,
  'x-small': 1,
  small: 2,
  medium: 3,
  large: 4,
  capital: 5,
  Capital: 5,
  commander: 6,
  titan: 7,
};

const sortBySize: Ord<StarAtlasNft> = {
  equals: (shipA, shipB) => shipA.mint === shipB.mint,
  compare: (shipA, shipB) => {
    const sizeA = shipSizes[shipA.attributes.class.toLowerCase()];
    const sizeB = shipSizes[shipB.attributes.class.toLowerCase()];

    if (sizeA === sizeB) {
      return 0;
    }

    if (sizeA > sizeB) {
      return -1;
    }

    return 1;
  },
};

export const getShipsNfts = (
  // TODO: add type
  size?: string
): TE.TaskEither<Err, StarAtlasNftArray> =>
  pipe(
    fetchNfts(),
    TE.map(({ data }) =>
      pipe(
        data,
        A.filter(
          (nft) =>
            nft.attributes.category === 'ship' &&
            (size
              ? nft.attributes.class.toLocaleLowerCase() ===
                size.toLocaleLowerCase()
              : true)
        ),
        A.sort(sortBySize)
      )
    )
  );
