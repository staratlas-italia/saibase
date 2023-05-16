import classNames from 'classnames';
import styled from 'styled-components';
import { Flex, FlexProps } from '../Flex';

type Props = FlexProps & {
  className?: string;
  disableRound?: boolean;
};

const Wrapper = styled(Flex)`
  clip-path: polygon(
    0 20px,
    20px 0,
    100% 0,
    100% calc(100% - 20px),
    calc(100% - 20px) 100%,
    0 100%
  );
`;

export const Card = ({ className, children, ...props }: Props) => {
  return (
    <Wrapper
      className={classNames(
        className,
        'relative z-10 border border-primary-border bg-primary-border'
      )}
      grow={1}
    >
      <Wrapper
        className={classNames(className, 'relative z-10 bg-primary-dark')}
        grow={1}
        p={6}
        {...props}
      >
        {children}
      </Wrapper>
    </Wrapper>
  );
};
