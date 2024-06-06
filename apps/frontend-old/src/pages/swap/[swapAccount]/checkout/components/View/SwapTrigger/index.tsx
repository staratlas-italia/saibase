import { getApiRoute } from '@saibase/routes-api';
import { Button } from '@saibase/uikit';
import { captureException } from '@sentry/nextjs';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { VersionedTransaction } from '@solana/web3.js';
import { useState } from 'react';
import { useCluster } from '../../../../../../../components/ClusterProvider';
import { useSwapStateAccount } from '../../../../../../../components/SwapStateAccountGuard';
import { useTransactionToast } from '../../../../../../../hooks/useTransactionToast';
import { Translation } from '../../../../../../../i18n/Translation';
import { usePaymentReference } from '../../ReferenceRetriever';

export const SwapTrigger = () => {
  const { cluster } = useCluster();

  const { publicKey, sendTransaction } = useWallet();

  const { connection } = useConnection();
  const { swapAccount, quantity } = useSwapStateAccount();

  const reference = usePaymentReference();
  const showTransactionToast = useTransactionToast();

  const [loading, setLoading] = useState(false);

  const handleDirectPayment = async () => {
    if (loading) {
      return;
    }

    try {
      if (!publicKey) {
        throw new WalletNotConnectedError();
      }

      setLoading(true);

      const currentUrl = new URL(
        `${window.location.origin}${getApiRoute('/api/swap')}`
      );

      currentUrl.searchParams.append('quantity', String(quantity ?? 1));
      currentUrl.searchParams.append('cluster', cluster);
      currentUrl.searchParams.append('reference', reference.toString());
      currentUrl.searchParams.append('stateAccount', swapAccount.toString());

      const { transaction: base64Tx } = await fetch(currentUrl, {
        method: 'POST',
        body: JSON.stringify({ account: publicKey.toString() }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json() as Promise<{ transaction: string }>);

      const transaction = VersionedTransaction.deserialize(
        Buffer.from(base64Tx, 'base64')
      );

      showTransactionToast(() => sendTransaction(transaction, connection));
    } catch (e) {
      captureException(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      kind="neutral"
      disabled={loading}
      loading={loading}
      size="small"
      onClick={handleDirectPayment}
    >
      <Translation id="citizenship.checkout.payDirectly.action.title" />
    </Button>
  );
};

const Loader = () => (
  <Button kind="neutral" disabled size="small">
    <Translation id="citizenship.checkout.payDirectly.action.title" />
  </Button>
);

SwapTrigger.Loader = Loader;
