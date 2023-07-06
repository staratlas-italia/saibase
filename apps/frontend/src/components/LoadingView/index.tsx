import { Card, Loader, Text } from '@saibase/uikit';
import { Translation } from '~/i18n/Translation';

export const LoadingView = () => (
  <Card py={5} className="space-x-3" justify="center" align="center">
    <Loader color="text-white" />

    <Text size="xl" color="text-white" weight="semibold">
      <Translation id="Layout.Loader.title" />
    </Text>
  </Card>
);
