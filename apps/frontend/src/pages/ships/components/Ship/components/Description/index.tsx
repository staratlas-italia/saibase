import { Text } from '@saibase/uikit';
import { useIntl } from 'react-intl';

type Props = {
  text: string;
};

export const Description = ({ text }: Props) => {
  const intl = useIntl();

  return (
    <Text as="p" size="base" smSize="lg" mdSize="xl" color="text-gray-100">
      {text.substring(0, 200).trim()}
      {'...'}
    </Text>
  );
};
