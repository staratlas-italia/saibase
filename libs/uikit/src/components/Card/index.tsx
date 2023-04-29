import { Flex, FlexProps } from '@saibase/uikit';
import classNames from 'classnames';

type Props = FlexProps & {
  border?: boolean;
  className?: string;
  disableRound?: boolean;
};

const isFirefox = () =>
  navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

export const Card = ({
  border,
  className,
  children,
  disableRound,
  ...props
}: Props) => {
  const isF = isFirefox();

  return (
    <Flex
      className={classNames(
        className,
        'z-10 bg-indigo-900',
        // 'bg-black z-10 backdrop-filter backdrop-blur-xl',
        {
          'rounded-3xl': !disableRound,
          'border-2 border-indigo-300': border, //   'bg-opacity-40': !isF,
          //   'bg-gray-600': isF,
        }
      )}
      {...props}
    >
      {children}
    </Flex>
  );
};
