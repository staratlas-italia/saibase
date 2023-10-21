import { Text } from '@saibase/uikit';
import { PropsWithChildren, ReactNode } from 'react';
import { Card } from '../Card';
import { Flex } from '../Flex';

type Props = PropsWithChildren<{ rightContent?: ReactNode }>;

export const Heading = ({ children, rightContent = null }: Props) => (
  <Card p={5} justify="between">
    <Text color="text-white" size="4xl" weight="bold">
      {children}
    </Text>

    <Flex align="center">{rightContent}</Flex>
  </Card>
);
