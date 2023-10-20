import { Button, Flex, Text } from '@saibase/uikit';
import Link from 'next/link';
import { Translation } from "../../../../../i18n/Translation";

export const CreatePlayerBanner = () => {
  return (
    <Flex
      align="center"
      justify="center"
      direction="col"
      className="bg-gray-700  rounded-xl space-y-3"
      p={3}
    >
      <Flex align="center" direction="col">
        <Text align="center" color="text-white" size="xl">
          <Translation id="dashboard.profile.missingPlayer.label" />
        </Text>
      </Flex>
      <Flex>
        <Link
          href="https://play.staratlas.com/faction"
          target="_blank"
          rel="noopener"
        >
          <Button kind="neutral" as="div" size="small">
            <Translation id="dashboard.profile.missingPlayer.cta" />
          </Button>
        </Link>
      </Flex>
    </Flex>
  );
};
