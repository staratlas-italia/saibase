import { PublicRoute } from '@saibase/routes-public';
import { Card, Flex, Text } from '@saibase/uikit';
import { useWallet } from '@solana/wallet-adapter-react';
import { Wallet } from '~/components/Wallet';
import { SignatureRefresher } from '~/components/auth/AssertAuthenticated/SignatureRefresher';
import { Redirect } from '~/components/common/Redirect';
import { Translation } from '~/i18n/Translation';
import { useAuthStore } from '~/stores/useAuthStore';
import { StrictReactNode } from '~/types';
import { getProofMessage } from '~/utils/getProofMessage';
import { isSignatureValid } from '~/utils/isSignatureValid';

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
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const signature = useAuthStore((s) => s.signature);

  const { publicKey } = useWallet();

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

  if (adminOnly && !isAdmin(publicKey)) {
    return <Redirect replace to={redirectUri} />;
  }

  if (
    !signature ||
    !publicKey ||
    !isSignatureValid({
      proof: signature,
      message: getProofMessage(),
      signer: publicKey,
    })
  ) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
