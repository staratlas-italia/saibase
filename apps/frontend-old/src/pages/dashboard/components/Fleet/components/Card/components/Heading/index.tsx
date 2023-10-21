import { Text, TextColor } from '@saibase/uikit';
import cx from 'classnames';

type Props = {
  color: TextColor;
  subtitle: string;
  title: string;
};

export const Heading = ({ color, subtitle, title }: Props) => (
  <Text
    as="h1"
    color={color}
    className={'tracking-tight'}
    mdSize="6xl"
    size="4xl"
    weight="extrabold"
  >
    <span className={cx(`block xl:inline`)}>{title}</span>
    <Text
      color="text-gray-200"
      className="mt-2 block"
      size="3xl"
      transform="uppercase"
      weight="semibold"
    >
      {subtitle}
    </Text>
  </Text>
);
