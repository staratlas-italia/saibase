import { WalletError } from '@solana/wallet-adapter-base';
import { WalletProvider as BaseWalletProvider } from '@solana/wallet-adapter-react';
import {
  LedgerWalletAdapter,
  MathWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SolongWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { PropsWithChildren, useCallback, useMemo } from 'react';

const WalletProvider = ({ children }: PropsWithChildren) => {
  const wallets = useMemo(
    () => [
      new LedgerWalletAdapter(),
      new MathWalletAdapter(),
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new SolongWalletAdapter(),
    ],
    []
  );

  const onError = useCallback((error: WalletError) => {
    console.error(error);
  }, []);

  return (
    <BaseWalletProvider wallets={wallets} onError={onError} autoConnect>
      {children}
    </BaseWalletProvider>
  );
};

export default WalletProvider;
