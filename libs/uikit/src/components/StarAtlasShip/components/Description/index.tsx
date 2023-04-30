import { Text } from '../../../Text';

type Props = {
  text: string;
};

export const Description = ({ text }: Props) => (
  <Text as="p" size="base" smSize="lg" mdSize="xl" color="text-gray-100">
    {text.substring(0, 200).trim()}
    {'...'}
  </Text>
);
