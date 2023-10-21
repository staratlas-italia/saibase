import { Card, Flex, Heading, Text } from '@saibase/uikit';
import { useWallet } from '@solana/wallet-adapter-react';
import { BadgesRetriever } from "../../../../components/BadgesRetriever";
import { FleetRetriever } from "../../../../components/FleetRetriever";
import { LoadingView } from "../../../../components/LoadingView";
import { SelfRetriever } from "../../../../components/SelfRetriever";
import { Translation } from "../../../../i18n/Translation";
import { Badges } from "../Badges";
import { Fleet } from '../Fleet';
import { Profile } from '../Profile';
import { ClaimAll } from './ClaimAll';

export const View = () => {
  const { wallet, connected } = useWallet();

  if (!wallet || !connected) {
    return (
      <Card px={3} py={2} justify="center">
        <Text align="center" color="text-white" size="4xl">
          <Translation id="Dashboard.Profile.Placeholder.title" />
        </Text>
      </Card>
    );
  }

  return (
    <SelfRetriever loader={<LoadingView />}>
      <Flex className="space-y-5" direction="col">
        <Profile />

        <Flex direction="col" className="z-10 space-y-5">
          <Heading>
            <Translation id="Badges.Heading.title" />
          </Heading>

          <BadgesRetriever loader={<LoadingView />}>
            <Badges />
          </BadgesRetriever>
        </Flex>

        <Flex direction="col" className="z-10 space-y-5">
          <Heading
            rightContent={
              <BadgesRetriever>
                <ClaimAll />
              </BadgesRetriever>
            }
          >
            <Translation id="Fleet.Heading.title" />
          </Heading>

          <FleetRetriever loader={<LoadingView />}>
            <Fleet />
          </FleetRetriever>
        </Flex>
      </Flex>
    </SelfRetriever>
  );
};
