import { fetchNftsByCategory } from '@saibase/star-atlas';
import { pipe } from 'fp-ts/function';
import type { NextApiRequest, NextApiResponse } from 'next';
import { promiseFromTaskEither } from '../../../utils/promiseFromTaskEither';

const handler = async (_: NextApiRequest, res: NextApiResponse) => {
  const ships = await pipe(
    fetchNftsByCategory({ category: 'ship' }),
    promiseFromTaskEither
  );

  res.status(200).json(ships);
};

export default handler;
