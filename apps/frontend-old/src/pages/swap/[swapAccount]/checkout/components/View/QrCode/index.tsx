import { getApiRoute } from '@saibase/routes-api';
import { getPublicRoute } from '@saibase/routes-public';
import { Flex } from '@saibase/uikit';
import { createQR, encodeURL } from '@solana/pay';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { match } from 'ts-pattern';
import { useCluster } from '../../../../../../../components/ClusterProvider';
import { useSwapStateAccount } from '../../../../../../../components/SwapStateAccountGuard';
import { usePaymentStore } from '../../../../../../../stores/usePaymentStore';
import { appendQueryParams } from '../../../../../../../utils/appendQueryParams';
import { fillUrlParameters } from '../../../../../../../utils/fillUrlParameters';
import { usePaymentReference } from '../../ReferenceRetriever';

export const QrCode = memo(() => {
  const router = useRouter();

  const { swapAccount, quantity, price } = useSwapStateAccount();

  const totalPrice = match(price)
    .with({ type: 'unit' }, ({ value }) => value * (quantity ?? 1))
    .with({ type: 'package' }, ({ value }) => value)
    .exhaustive();

  const { cluster } = useCluster();
  const confirmPayment = usePaymentStore((s) => s.confirm);

  const { publicKey } = useWallet();

  const reference = usePaymentReference();
  const qrRef = useRef<HTMLDivElement>(null);

  const url = useMemo(() => {
    const currentUrl = new URL(
      `${window.location.origin}${getApiRoute('/api/swap')}`
    );

    currentUrl.searchParams.append('cluster', cluster);
    currentUrl.searchParams.append('reference', reference.toString());
    currentUrl.searchParams.append('publicKey', publicKey?.toString() || '');
    currentUrl.searchParams.append('stateAccount', swapAccount.toString());

    return encodeURL({
      link: currentUrl,
    });
  }, [cluster, reference, publicKey, swapAccount]);

  useEffect(() => {
    const qr = createQR(url, 250, 'transparent');

    if (qrRef.current && totalPrice > 0) {
      qrRef.current.innerHTML = '';
      qr.append(qrRef.current);
    }
  });

  const recusiveConfirm = useCallback(async () => {
    if (!publicKey) {
      return;
    }

    const status = await confirmPayment({
      amount: totalPrice,
      cluster,
      publicKey: publicKey.toString(),
      reference,
    });

    if (status !== null) {
      if (status) {
        router.push(
          appendQueryParams(
            fillUrlParameters(
              getPublicRoute('/swap/:swapAccount/checkout/confirmed'),
              {
                swapAccount: swapAccount.toString(),
              }
            ),
            { cluster }
          )
        );

        return;
      }

      router.push(
        appendQueryParams(
          fillUrlParameters(
            getPublicRoute('/swap/:swapAccount/checkout/error'),
            {
              swapAccount: swapAccount.toString(),
            }
          ),
          { cluster }
        )
      );
      return;
    }
  }, [
    totalPrice,
    cluster,
    confirmPayment,
    publicKey,
    reference,
    router,
    swapAccount,
  ]);

  useEffect(() => {
    const interval = setInterval(recusiveConfirm, 2000);

    return () => clearInterval(interval);
  }, [publicKey, recusiveConfirm]);

  return (
    <Flex className="bg-white rounded-lg">
      <div ref={qrRef} />
    </Flex>
  );
});

QrCode.displayName = 'QrCode';
