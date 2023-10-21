import { Flex, Text } from '@saibase/uikit';
import { isSignatureLegit } from '@saibase/web3';
import { useWallet } from '@solana/wallet-adapter-react';
import { Translation } from '../../../i18n/Translation';
import { useAuthStore } from '../../../stores/useAuthStore';
import { StrictReactNode } from '../../../types';
import { getProofMessage } from '../../../utils/getProofMessage';
import { Routes } from '../../../utils/getRoute';
import { Wallet } from '../../Wallet';
import { Redirect } from '../../common/Redirect';
import { BlurBackground } from '../../layout/BlurBackground';
import { SignatureRefresher } from './SignatureRefresher';

type Props = {
  adminOnly?: boolean;
  children: StrictReactNode;
  fallback?: StrictReactNode;
  redirectUri?: Routes;
};

export const AssertAuthenticated = ({
  adminOnly,
  children,
  redirectUri = '/dashboard',
  fallback = <SignatureRefresher />,
}: Props) => {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const signature = useAuthStore((s) => s.signature);

  const { publicKey } = useWallet();

  if (!publicKey) {
    <Flex pt={32}>
      <BlurBackground p={5} justify="center" className="mx-auto">
        <Text align="center" color="text-white" size="4xl">
          <Translation id="Dashboard.Profile.Placeholder.title" />
        </Text>

        <Flex pt={5}>
          <Wallet />
        </Flex>
      </BlurBackground>
    </Flex>;
  }

  if (adminOnly && !isAdmin(publicKey)) {
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
