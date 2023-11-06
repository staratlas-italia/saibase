import { Flex, FlexProps } from '@saibase/uikit';
import classNames from 'classnames';
import { isFirefox } from '../../../utils/isFirefox';

type Props = FlexProps & { className?: string } & { disableRound?: boolean };

export const BlurBackground = ({
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
        'bg-black  backdrop-filter backdrop-blur-xl',
        {
          'rounded-3xl': !disableRound,
          'bg-opacity-40': !isF,
          'bg-gray-600': isF,
        }
      )}
      {...props}
    >
      {children}
    </Flex>
  );
};
