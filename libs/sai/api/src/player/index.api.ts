import { fetchPlayer } from '@saibase/star-atlas';
import { parsePublicKey } from '@saibase/web3';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async ({ query }: NextApiRequest, res: NextApiResponse) => {
  const { pubkey } = query;

  if (!pubkey) {
    res.status(404).json({
      error: 'Invalid player pubkey',
    });
  }

  const result = await pipe(
    parsePublicKey(pubkey as string),
    TE.fromEither,
    TE.chainW((publicKey) => fetchPlayer(publicKey)),
    TE.map((response) => response.data)
  )();

  if (E.isLeft(result)) {
    return res.status(200).json(null);
  }

  res.status(200).json(result.right);
};

export default handler;