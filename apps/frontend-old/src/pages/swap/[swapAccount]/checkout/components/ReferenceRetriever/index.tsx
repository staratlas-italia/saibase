import { captureException } from '@sentry/nextjs';
import { useWallet } from '@solana/wallet-adapter-react';
import invariant from 'invariant';
import { useRouter } from 'next/router';
import { PropsWithChildren, ReactNode, useEffect } from 'react';
import { useSwapStateAccount } from '../../../../../../components/SwapStateAccountGuard';

import { getPublicRoute } from '@saibase/routes-public';
import { usePaymentStore } from '../../../../../../stores/usePaymentStore';

type Props = {
  loader?: ReactNode;
};

export const ReferenceRetriever = ({
  children,
  loader,
}: PropsWithChildren<Props>) => {
  const { publicKey } = useWallet();
  const { swapAccount } = useSwapStateAccount();

  const [reference, fetchReference] = usePaymentStore((s) => [
    s.reference,
    s.fetchReference,
  ]);

  const { query, replace } = useRouter();

  const { cluster } = query;

  useEffect(() => {
    if (publicKey && !reference) {
      try {
        fetchReference({ publicKey, swapAccount });
      } catch (e) {
        captureException(e, { level: 'error' });

        replace(getPublicRoute('/dashboard'));
      }
    }
  }, [reference, fetchReference, cluster, replace, publicKey, swapAccount]);

  if (reference === null && loader) {
    return <>{loader}</>;
  }

  if (!reference) {
    return null;
  }

  return <>{children}</>;
};

export const usePaymentReference = () => {
  const reference = usePaymentStore((s) => s.reference);

  invariant(
    reference,
    'This hook is meant to be used inside a ReferenceRetriever component'
  );

  return reference;
};
