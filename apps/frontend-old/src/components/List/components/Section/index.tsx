import { Flex, Text } from '@saibase/uikit';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{ title: string }>;

export const Section = ({ children, title }: Props) => {
  return (
    <Flex direction="col">
      <Flex pl={2}>
        <Text
          weight="bold"
          size="sm"
          color="text-gray-600"
          transform="uppercase"
        >
          {title}
        </Text>
      </Flex>
      {children}
    </Flex>
  );
};
