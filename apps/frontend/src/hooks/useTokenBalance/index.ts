import { getTokenBalanceByTokenAddress } from '@saibase/web3';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';

export const useTokenBalance = (address: PublicKey) => {
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  const { connection } = useConnection();

  useEffect(() => {
    const run = async () => {
      setLoading(true);

      const balance = await getTokenBalanceByTokenAddress({
        connection,
        address,
      })();

      setBalance(balance);
      setLoading(false);
    };

    run();
  }, [address, connection]);

  return { balance, loading };
};
