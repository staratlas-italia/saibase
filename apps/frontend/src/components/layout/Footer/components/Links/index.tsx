import { Flex, Text } from '@saibase/uikit';
import Link from 'next/link';
import { Translation } from '~/i18n/Translation';

export const Links = () => {
  return (
    <Flex className="space-x-3">
      <Link
        href="https://staratlasitalia.com/termini-condizioni/"
        target="_blank"
      >
        <Text decoration="underline" size="xs">
          <Translation id="Layout.Footer.TermsAndCondition.action.title" />
        </Text>
      </Link>
      <Link href="https://staratlasitalia.com/privacy-policy/" target="_blank">
        <Text decoration="underline" size="xs">
          <Translation id="Layout.Footer.PrivacyPolicy.action.title" />
        </Text>
      </Link>
    </Flex>
  );
};
