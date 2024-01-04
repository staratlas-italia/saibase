import { getPublicRoute } from '@saibase/routes-public';
import { Flex, Text } from '@saibase/uikit';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Translation } from '../../i18n/Translation';
import { appendQueryParams } from '../../utils/appendQueryParams';
import { fillUrlParameters } from '../../utils/fillUrlParameters';
import { useQuattrinoAccounts } from './useQuattrinoAccounts';

const BadgeBlock = styled(Flex).attrs({
  className:
    'overflow-hidden cursor-pointer max-w-md w-full rounded-2xl transition-all md:hover:scale-105',
})`
  position: relative;
`;

const TitleWrapper = styled(Flex).attrs({
  className: 'bg-white overflow-hidden',
})``;

const numberFormatter = new Intl.NumberFormat();

const Tutor = () => {
  const router = useRouter();

  const query = router.query as Record<string, string | number>;

  const { accounts, states } = useQuattrinoAccounts();

  return (
    <>
      <Flex justify="center" px={10}>
        <Text align="center" color="text-white" size="6xl" weight="bold" shadow>
          <Translation id="tutor.badgeSelector.title" />
        </Text>
      </Flex>

      <Flex
        className="space-y-10 lg:space-y-0 lg:space-x-12"
        direction="col"
        lgDirection="row"
        align="center"
        lgAlign="start"
        justify="center"
        p={8}
      >
        {(['s', 'm', 'l'] as const).map((size) => {
          const account = accounts[size];
          const state = states[account];
          const quantity = numberFormatter.format(state?.quantity || 0);

          return (
            <BadgeBlock
              direction="col"
              key={size}
              onClick={() =>
                router.push(
                  appendQueryParams(
                    fillUrlParameters(getPublicRoute('/swap/:swapAccount'), {
                      swapAccount: account,
                    }),
                    query
                  )
                )
              }
            >
              <Flex>
                <img
                  alt={`tutor-badge-${size}`}
                  src={`/images/resources/quattrino-coin-square.webp`}
                />
              </Flex>

              <TitleWrapper direction="col">
                <Flex direction="col">
                  <Flex direction="col" py={4} px={6} className="md:py-3">
                    <Text size="3xl" weight="semibold">
                      {state?.name || 'Unknown'}
                    </Text>

                    <Flex pt={2}>
                      <Text size="xl">
                        <Translation
                          id="quattrino.selector.quantity"
                          values={{
                            items: quantity,
                          }}
                        />
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>

                <Flex direction="col" px={6} py={8}>
                  {state.prices && (
                    <Flex direction="col">
                      <Text
                        transform="uppercase"
                        weight="semibold"
                        color="text-gray-400"
                      >
                        <Translation id="generic.price" />
                      </Text>

                      <Text size="lg" decoration="line-through">
                        {state.prices.full} {state.vaultCurrency}
                      </Text>

                      {state.discounts && (
                        <>
                          <Flex align="center">
                            <Text size="3xl" weight="semibold">
                              {state.prices.real} {state.vaultCurrency}
                            </Text>

                            <Flex pl={3}>
                              <Text
                                size="lg"
                                weight="semibold"
                                color="text-emerald-500"
                              >
                                <Translation
                                  id="tutor.discount.perc"
                                  values={{
                                    discount:
                                      state.discounts.preReleaseDiscount.toString(),
                                  }}
                                />
                              </Text>
                            </Flex>
                          </Flex>
                        </>
                      )}
                    </Flex>
                  )}
                </Flex>
              </TitleWrapper>
            </BadgeBlock>
          );
        })}
      </Flex>
    </>
  );
};

export default Tutor;
