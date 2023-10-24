import { useFeature } from '@growthbook/growthbook-react';
import { PublicRoute } from '@saibase/routes-public';
import { Card, Flex, Text } from '@saibase/uikit';
import { isSignatureLegit } from '@saibase/web3';
import { useWallet } from '@solana/wallet-adapter-react';
import { Translation } from '../../../i18n/Translation';
import { useAuthStore } from '../../../stores/useAuthStore';
import { StrictReactNode } from '../../../types';
import { getProofMessage } from '../../../utils/getProofMessage';
import { Wallet } from '../../Wallet';
import { Redirect } from '../../common/Redirect';
import { SignatureRefresher } from './SignatureRefresher';

type Props = {
  adminOnly?: boolean;
  children: StrictReactNode;
  fallback?: StrictReactNode;
  redirectUri?: PublicRoute;
};

export const AssertAuthenticated = ({
  adminOnly,
  children,
  redirectUri = '/dashboard',
  fallback = <SignatureRefresher />,
}: Props) => {
  const { publicKey } = useWallet();

  const adminPbks = useFeature<string[]>('sai-frontend-admins-pbks').value;

  const isAdmin = adminPbks?.includes(publicKey?.toString() || '');
  const signature = useAuthStore((s) => s.signature);

  if (!publicKey) {
    <Flex pt={32}>
      <Card p={5} justify="center" className="mx-auto">
        <Text align="center" color="text-white" size="4xl">
          <Translation id="Dashboard.Profile.Placeholder.title" />
        </Text>

        <Flex pt={5}>
          <Wallet />
        </Flex>
      </Card>
    </Flex>;
  }

  if (adminOnly && !isAdmin) {
    return <Redirect replace to={redirectUri} />;
  }

  if (
    !signature ||
    !publicKey ||
    !isSignatureLegit({
      proof: signature,
      message: getProofMessage(),
    })(publicKey)
  ) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
