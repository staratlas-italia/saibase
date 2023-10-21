import { mints } from '@saibase/constants';
import { getTokenBalanceByMint } from '@saibase/web3';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { Tier } from "../../../types";

export const useAirdropToken = () => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();

  const [loading, setLoading] = useState(false);
  const [tier, setTier] = useState<Tier>();

  useEffect(() => {
    const run = async () => {
      if (connected && publicKey) {
        setLoading(true);

        const promises = [mints.tier1, mints.tier2, mints.tier3].map(
          async (tierMint) =>
            await getTokenBalanceByMint(connection, publicKey, tierMint)()
        );

        const ammounts = (await Promise.all(promises)) as [
          number,
          number,
          number
        ];

        const tierIndex = ammounts.findIndex((item) => item > 0);

        setTimeout(() => {
          if (tierIndex >= 0) {
            setTier(`tier${tierIndex + 1}` as Tier);
          }
          setLoading(false);
        }, 1500);
      }
    };

    run();
  }, [connection, connected, publicKey]);

  return { loading, tier };
};
