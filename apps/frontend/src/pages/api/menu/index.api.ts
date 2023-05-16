import { menuApiHandler } from '@saibase/sai-api';
import { pipe } from 'fp-ts/function';
import { NextApiRequest, NextApiResponse } from 'next';
import { matchMethodMiddleware } from '~/middlewares/matchMethod';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { from, publicKey, locale } = req.query;

  const response = menuApiHandler({
    from: from as string,
    publicKey: publicKey as string,
    locale: locale as string,
  });

  res.json(response);
};

export default pipe(handler, matchMethodMiddleware(['GET']));
