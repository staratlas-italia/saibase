import { Text } from '@saibase/uikit';
import { useWallet } from '@solana/wallet-adapter-react';
import { BadgesRetriever } from '../../../../components/BadgesRetriever';
import { FleetRetriever } from '../../../../components/FleetRetriever';
import { LoadingView } from '../../../../components/LoadingView';
import { SelfRetriever } from '../../../../components/SelfRetriever';
import { Heading } from '../../../../components/common/Heading';
import { BlurBackground } from '../../../../components/layout/BlurBackground';
import { Flex } from '../../../../components/layout/Flex';
import { Translation } from '../../../../i18n/Translation';
import { Badges } from '../Badges';
import { Fleet } from '../Fleet';
import { Profile } from '../Profile';
import { ClaimAll } from './ClaimAll';

export const View = () => {
  const { wallet, connected } = useWallet();

  if (!wallet || !connected) {
    return (
      <BlurBackground px={3} py={2} justify="center">
        <Text align="center" color="text-white" size="4xl">
          <Translation id="Dashboard.Profile.Placeholder.title" />
        </Text>
      </BlurBackground>
    );
  }

  return (
    <SelfRetriever loader={<LoadingView />}>
      <Flex className="space-y-5" direction="col">
        <Profile />

        <Flex direction="col" className="z-10 space-y-5">
          <Heading title="Badges.Heading.title" />

          <BadgesRetriever loader={<LoadingView />}>
            <Badges />
          </BadgesRetriever>
        </Flex>

        <Flex direction="col" className="z-10 space-y-5">
          <Heading
            title="Fleet.Heading.title"
            rightContent={
              <BadgesRetriever>
                <ClaimAll />
              </BadgesRetriever>
            }
          />

          <FleetRetriever loader={<LoadingView />}>
            <Fleet />
          </FleetRetriever>
        </Flex>
      </Flex>
    </SelfRetriever>
  );
};
