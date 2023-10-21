import { ScoreVarsShipInfo, getShipInfo } from '@saibase/star-atlas';
import { isPublicKey } from '@saibase/web3';
import { Cluster, Connection, PublicKey } from '@solana/web3.js';
import * as E from 'fp-ts/Either';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnectionClusterUrl } from "../../../../utils/connection";

export type ResponseData =
  | {
      success: false;
      error: unknown;
    }
  | {
      success: true;
      data: ScoreVarsShipInfo;
    };

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const {
    query: { cluster, mint },
  } = req;

  const connection = new Connection(
    getConnectionClusterUrl(cluster as Cluster)
  );

  if (!mint || !isPublicKey(mint as string)) {
    res.status(200).json({
      success: false,
      error: 'Invalid mint pubkey',
    });
    return;
  }

  const result = await getShipInfo({
    connection,
    shipMint: new PublicKey(mint),
  })();

  if (E.isLeft(result)) {
    return res
      .status(400)
      .json({ success: false, error: { type: result.left.type } });
  }

  const account = result.right;

  res.status(200).json({
    success: true,
    data: {
      shipMint: account.shipMint.toString(),
      rewardRatePerSecond: account.rewardRatePerSecond.toNumber(),
      fuelMaxReserve: account.fuelMaxReserve,
      foodMaxReserve: account.foodMaxReserve,
      armsMaxReserve: account.armsMaxReserve,
      toolkitMaxReserve: account.toolkitMaxReserve,
      millisecondsToBurnOneFuel: account.millisecondsToBurnOneFuel,
      millisecondsToBurnOneFood: account.millisecondsToBurnOneFood,
      millisecondsToBurnOneArms: account.millisecondsToBurnOneArms,
      millisecondsToBurnOneToolkit: account.millisecondsToBurnOneToolkit,
    },
  });
};

export default handler;
