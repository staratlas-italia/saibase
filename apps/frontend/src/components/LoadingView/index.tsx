import { Card, Flex, Loader, Text } from '@saibase/uikit';
import { Translation } from '../../i18n/Translation';

export const LoadingText = () => (
  <Flex direction="row" justify="center" align="center" className="space-x-3">
    <Loader color="text-white" />

    <Text size="xl" color="text-white" weight="semibold">
      <Translation id="Layout.Loader.title" />
    </Text>
  </Flex>
);

export const LoadingView = () => (
  <Card py={5} justify="center" align="center">
    <LoadingText />
  </Card>
);
