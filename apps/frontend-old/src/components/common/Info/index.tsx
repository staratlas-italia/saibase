import { Text } from '@saibase/uikit';
import { PropsWithChildren } from 'react';
import { Flex } from '../../layout/Flex';
import { Loader } from '../Loader';
import { TextColor } from '../Text/types';

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
