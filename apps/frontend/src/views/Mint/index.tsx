import { Card, Flex, Text } from '@saibase/uikit';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { LoadingView } from "../../components/LoadingView";
import { ConnectButton } from "../../components/Wallet/components/ConnectButton";
import { Redirect } from "../../components/common/Redirect";
import { Translation } from "../../i18n/Translation";
import { useAirdropToken } from './useAirdropToken';

export const MintPage = () => {
  const { loading, tier } = useAirdropToken();
  const { wallet, connected } = useWallet();
  const [counter, setCounter] = useState(5);
  const [route, setRoute] = useState<string>();

  useEffect(() => {
    if (tier) {
      if (counter > 0) {
        setTimeout(() => setCounter((counter) => counter - 1), 1000);
      } else {
        setRoute(`https://${tier}.staratlasitalia.com`);
      }
    }
  }, [counter, tier]);

  if (!wallet || !connected) {
    return (
      <Card px={5} py={3} justify="center">
        <Flex direction="col" className="space-y-3" align="center">
          <Text align="center" color="text-white" size="4xl">
            <Translation id="Dashboard.Profile.Placeholder.title" />
          </Text>
          <ConnectButton />
        </Flex>
      </Card>
    );
  }

  if (route) {
    return <Redirect replace to={route} />;
  }

  if (tier) {
    // return (
    //   <LoadingView
    //     title="Mint.Hyperspace.text"
    //     values={{ seconds: counter.toString() }}
    //   />
    // );
    return <LoadingView />;
  }

  if (!loading && !tier) {
    return (
      <Card px={3} py={2} justify="center">
        <Text align="center" color="text-white" size="4xl">
          <Translation id="Mint.AccessDenied.text" />
        </Text>
      </Card>
    );
  }

  return <LoadingView />;
};
