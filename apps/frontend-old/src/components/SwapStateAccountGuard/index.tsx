import { useFeature } from '@growthbook/growthbook-react';
import { getPublicRoute } from '@saibase/routes-public';
import invariant from 'invariant';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import {
  DEVNET_TOKEN_SWAP_STATE_ACCOUNTS,
  TOKEN_SWAP_STATE_ACCOUNTS,
} from '../../common/constants';
import { isCitizenshipSwap } from '../../common/constants/citizenship';
import { isQuattrinoSwap } from '../../common/constants/quattrino';
import { isTutorSwap } from '../../common/constants/tutor';
import { useBadges } from '../../hooks/useNullableBadges';
import {
  useCitizenshipBadges,
  useTutorBadge,
} from '../../stores/useBadgesStore';
import { allGenesisBadgeMints } from '../../utils/getBadgeByMint';
import { isValidSwapStateAccount } from '../../utils/isValidSwapStateAccount';
import { useCluster } from '../ClusterProvider';
import { Redirect } from '../common/Redirect';

export const SwapStateAccountGuard = ({
  children,
}: PropsWithChildren<unknown>) => {
  const { cluster } = useCluster();
  const { swapAccount } = useRouter().query;

  const badges = useBadges();
  const tutorBadges = useTutorBadge();
  const citizenshipBadges = useCitizenshipBadges();

  const hasGenesisOrTutorOrCitizenshipBadge =
    Boolean(tutorBadges) ||
    Boolean(citizenshipBadges?.length) ||
    badges.some((badge) =>
      allGenesisBadgeMints.includes(badge.mint.address.toString())
    );

  const isTutorPurchaseDisabled = useFeature(
    'sai-frontend-enabled-tutor-purchase'
  ).off;

  const isCitizenshipPurchaseDisabled = useFeature(
    'sai-frontend-enabled-citizenship-purchase'
  ).off;

  if (!isValidSwapStateAccount(cluster, swapAccount as string)) {
    return <Redirect replace to={getPublicRoute('/dashboard')} />;
  }

  if (isTutorPurchaseDisabled && isTutorSwap(swapAccount as string)) {
    return <Redirect replace to={getPublicRoute('/dashboard')} />;
  }

  if (
    isCitizenshipPurchaseDisabled &&
    isCitizenshipSwap(swapAccount as string)
  ) {
    return <Redirect replace to={getPublicRoute('/dashboard')} />;
  }

  if (
    isQuattrinoSwap(swapAccount as string) &&
    !hasGenesisOrTutorOrCitizenshipBadge
  ) {
    return <Redirect replace to={getPublicRoute('/dashboard')} />;
  }

  return <>{children}</>;
};

export const useSwapStateAccount = () => {
  const { cluster } = useCluster();
  const { swapAccount } = useRouter().query;

  invariant(
    swapAccount,
    'This hook is meant to be used insied a SwapStateAccountGuard component'
  );

  return (
    cluster === 'devnet'
      ? DEVNET_TOKEN_SWAP_STATE_ACCOUNTS
      : TOKEN_SWAP_STATE_ACCOUNTS
  )[swapAccount as string];
};
