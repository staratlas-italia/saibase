import { NextApiRequest, NextApiResponse } from 'next';

const handler = async ({ query }: NextApiRequest, res: NextApiResponse) => {
  const { pubkey } = query;

  if (!pubkey) {
    res.status(404).json({
      error: 'Invalid player pubkey',
    });
  }

  const response = await fetch(
    `${process.env.STAR_ATLAS_API_URL}/players/${pubkey}`
  );

  const data = await response.json();

  res.status(200).json(data);
};

export default handler;
