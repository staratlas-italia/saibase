import { mints } from '@saibase/constants';
import { getTokenBalanceByMint, isPublicKey } from '@saibase/web3';
import { Cluster, Connection, PublicKey } from '@solana/web3.js';
import { NextApiRequest, NextApiResponse } from 'next';
import { getConnectionClusterUrl } from "../../../utils/connection";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { cluster, pbk },
  } = req;

  const connection = new Connection(
    getConnectionClusterUrl(cluster as Cluster)
  );

  if (!pbk || !isPublicKey(pbk as string)) {
    res.status(200).json({
      success: false,
      error: 'Invalid pubkey',
    });
    return;
  }

  const foodAmountAccount = await getTokenBalanceByMint(
    connection,
    new PublicKey(pbk),
    mints.food
  )();

  const fuelAmountAccount = await getTokenBalanceByMint(
    connection,
    new PublicKey(pbk),
    mints.fuel
  )();

  const ammoAmountAccount = await getTokenBalanceByMint(
    connection,
    new PublicKey(pbk),
    mints.ammo
  )();

  const toolAmountAccount = await getTokenBalanceByMint(
    connection,
    new PublicKey(pbk),
    mints.toolkit
  )();

  res.status(200).json({
    success: true,
    data: {
      food: foodAmountAccount,
      fuel: fuelAmountAccount,
      ammo: ammoAmountAccount,
      tools: toolAmountAccount,
    },
  });
};

export default handler;
