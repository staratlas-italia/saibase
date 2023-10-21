import { Flex, Text, TextColor } from '@saibase/uikit';
import { PropsWithChildren } from 'react';
import { Loader } from '../Loader';

type Props = PropsWithChildren<{
  color?: TextColor;
  loading?: boolean;
  title?: string;
}>;

export const InfoRow = ({ color, loading, title, children }: Props) => {
  return (
    <Flex>
      <Flex direction="col">
        <Text size="xl">
          {loading ? (
            <Flex pl={2}>
              <Loader color="text-white" />
            </Flex>
          ) : (
            children || '-'
          )}
        </Text>
        <Text
          weight="bold"
          transform="uppercase"
          size="sm"
          color={color || 'text-gray-300'}
        >
          {title}
        </Text>
      </Flex>
    </Flex>
  );
};
