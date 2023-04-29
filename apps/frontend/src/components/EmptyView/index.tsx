import { Card, Text } from '@saibase/uikit';

type Props = {
  title: string;
};

export const EmptyView = ({ title }: Props) => (
  <Card
    py={5}
    justify="center"
    align="center"
    direction="col"
    className="space-y-3"
  >
    <Text size="xl" color="text-white" weight="semibold">
      {title}
    </Text>
  </Card>
);
