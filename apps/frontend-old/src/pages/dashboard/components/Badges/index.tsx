import { Flex, Text } from '@saibase/uikit';
import Link from 'next/link';
import { EmptyView } from '../../../../components/EmptyView';
import { BlurBackground } from '../../../../components/layout/BlurBackground';
import { useBadges } from '../../../../hooks/useNullableBadges';

export const Badges = () => {
  const badges = useBadges();

  return (
    <>
      {!badges?.length ? (
        <EmptyView title="No badges found" />
      ) : (
        <Flex className="space-x-3 overflow-x-auto pb-1">
          {badges.map(([badge, metadata]) => (
            <BlurBackground
              key={badge.mintAddress.toString()}
              disableRound
              direction="col"
              className=" rounded-lg max"
              p={1}
              shrink={1}
            >
              <Flex
                key={badge.mintAddress.toString()}
                className="w-44 h-44 rounded-lg overflow-hidden relative"
              >
                <img alt="badge" src={metadata?.image} />
              </Flex>

              <Flex justify="center" shrink={1} py={2} px={1}>
                <Link
                  href={`https://solscan.io/account/${badge.mintAddress.toString()}`}
                  target="_blank"
                >
                  <Text
                    align="center"
                    color="text-white"
                    decoration="underline"
                  >
                    {badge.name}
                  </Text>
                </Link>
              </Flex>
            </BlurBackground>
          ))}
        </Flex>
      )}
    </>
  );
};
