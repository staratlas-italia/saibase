import { appVersion } from '@saibase/configuration';
import { Flex, Text } from '@saibase/uikit';
import Link from 'next/link';
import { LocaleSelector } from '~/components/LocaleSelector';
import { SocialLinks } from '~/components/layout/SideBarLayout/components/SideBar/components/SocialLinks';
import { Translation } from '~/i18n/Translation';

export const Footer = () => (
  <Flex direction="col">
    <Flex justify="center" pb={5}>
      <LocaleSelector />
    </Flex>
    <Flex pb={8} justify="center">
      <Link
        href="https://staratlasitalia.canny.io/sai-web3-app"
        target="_blank"
      >
        <Text color="text-white" weight="semibold" size="sm">
          <Translation id="Layout.Sidebar.Feedback.title" />
        </Text>
      </Link>
    </Flex>

    <SocialLinks />

    <Flex pb={8} justify="center">
      <Text color="text-white" size="xs" weight="semibold">
        v{appVersion}
      </Text>
    </Flex>
  </Flex>
);
