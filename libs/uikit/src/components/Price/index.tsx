import classNames from 'classnames';
import { FormattedNumber } from 'react-intl';
import styled from 'styled-components';
import { Flex } from '../Flex';
import { Text, TextProps } from '../Text';

export type Currency = 'ATLAS' | 'POLIS' | 'USDC' | 'NONE';

type Props = TextProps & {
  currency?: Currency;
  decimals?: number;
  inverse?: boolean;
  small?: boolean;
  value?: number | string;
};

type P = { small?: boolean };

const CurrencyImage = styled.img<P>`
  width: ${({ small }) => (small ? 15 : 20)}px;
  height: ${({ small }) => (small ? 15 : 20)}px;
`;

export const Price = ({
  currency = 'USDC',
  decimals = 2,
  small,
  value,
  inverse,
  ...props
}: Props) => {
  return (
    <Flex
      direction={inverse ? 'row-reverse' : 'row'}
      as="span"
      align="center"
      className={classNames('space-x-1', {
        'space-x-reverse': inverse,
      })}
    >
      <Text {...props}>
        {value !== undefined ? (
          <FormattedNumber
            value={+(value || 0)}
            minimumFractionDigits={decimals}
            maximumFractionDigits={decimals}
          />
        ) : (
          '-'
        )}
      </Text>
      {value !== undefined && currency !== 'NONE' && (
        <CurrencyImage
          small={small}
          src={`/images/currencies/${currency.toLowerCase()}_symbol.png`}
        />
      )}
    </Flex>
  );
};
