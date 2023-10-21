import * as E from 'fp-ts/Either';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getShipsNfts } from "../../../network/ships/getAllShips";

const handler = async (_: NextApiRequest, res: NextApiResponse) => {
  const result = await getShipsNfts()();

  if (E.isLeft(result)) {
    return res.status(400).json(result.left);
  }

  res.status(200).json(result.right);
};

export default handler;
