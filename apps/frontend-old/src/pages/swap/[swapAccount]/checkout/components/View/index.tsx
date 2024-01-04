import { ShieldCheckIcon } from '@heroicons/react/outline';
import { Flex, Text } from '@saibase/uikit';
import styled from 'styled-components';
import { match } from 'ts-pattern';
import { useSwapStateAccount } from '../../../../../../components/SwapStateAccountGuard';
import { Wallet } from '../../../../../../components/Wallet';
import { Loader as CLoader } from '../../../../../../components/common/Loader';
import { BlurBackground } from '../../../../../../components/layout/BlurBackground';
import { Container } from '../../../../../../components/layout/Container';
import { Logo } from '../../../../../../components/layout/Header';
import { Translation } from '../../../../../../i18n/Translation';
import { ReferenceRetriever } from '../ReferenceRetriever';
import { QrCode } from './QrCode';
import { SwapTrigger } from './SwapTrigger';

const LoaderContainer = styled(Flex)`
  width: 250px;
  height: 250px;
`;

const Loader = () => (
  <LoaderContainer
    align="center"
    className="bg-white rounded-md"
    justify="center"
  >
    <CLoader />
  </LoaderContainer>
);

const Icon = styled.img`
  object-fit: contain;
`;

const CartItem = () => {
  const { name, vaultCurrency, image, quantity, price } = useSwapStateAccount();

  const unitPrice = match(price)
    .with({ type: 'unit' }, ({ value }) => value)
    .with({ type: 'package' }, ({ value }) => value / (quantity ?? 1))
    .exhaustive();

  return (
    <Flex justify="between" className="space-x-3">
      <Flex className="w-20 h-20 rounded-md overflow-hidden">
        <Icon src={image.square} />
      </Flex>

      <Flex direction="col" grow={1}>
        <Text color="text-white" size="lg" weight="bold">
          {name}
        </Text>

        <Text color="text-white" weight="bold">
          x{new Intl.NumberFormat().format(quantity || 1)}
        </Text>
      </Flex>

      <Flex align="center">
        <Text color="text-white">
          {unitPrice.toFixed(4)} {vaultCurrency}
        </Text>
      </Flex>
    </Flex>
  );
};

export const View = () => {
  const { sections, quantity, vaultCurrency, price } = useSwapStateAccount();

  const totalPrice = match(price)
    .with({ type: 'unit' }, ({ value }) => value * (quantity ?? 1))
    .with({ type: 'package' }, ({ value }) => value)
    .exhaustive();

  return (
    <Container>
      <Flex direction="col" align="center" justify="center" pt={24} pb={52}>
        <BlurBackground p={8} direction="col" className="max-w-lg">
          <Flex direction="col" className="space-y-5 ">
            <Flex justify="between">
              <Logo />

              <Wallet hideSettings />
            </Flex>

            <Text color="text-white" weight="bold" size="4xl">
              <Translation id={sections.checkout.title} />
            </Text>

            <Text color="text-gray-200">
              <Translation id={sections.checkout.subtitle} />
            </Text>

            <Flex direction="col" className="space-y-5 divide-y-2">
              <CartItem />

              <Flex pt={5} justify="between">
                <Text color="text-white" weight="semibold">
                  <Translation id="citizenship.checkout.cart.total.label" />
                </Text>

                <Text color="text-white" weight="semibold">
                  {totalPrice.toFixed(2)} {vaultCurrency}
                </Text>
              </Flex>
            </Flex>
          </Flex>

          <Flex pt={5} justify="center" px={12}>
            <ReferenceRetriever loader={<Loader />}>
              <QrCode />
            </ReferenceRetriever>
          </Flex>

          <Flex className="space-y-5" direction="col" pt={5} justify="center">
            <Flex
              align="center"
              className="space-y-3"
              direction="col"
              pt={5}
              lgPx={8}
              justify="center"
            >
              <Text
                align="center"
                color="text-gray-200"
                size="xl"
                weight="semibold"
              >
                <Translation id="swap.checkout.qrcode.hint.0" />
              </Text>

              <Flex align="center" className="space-x-2">
                <ShieldCheckIcon className="w-6 h-6 text-gray-300" />

                <Text size="sm" align="center" color="text-gray-300">
                  <Translation id="swap.checkout.qrcode.hint.1" />
                </Text>
              </Flex>
            </Flex>

            <Flex justify="center">
              <Text size="xs" color="text-gray-200">
                <Translation id="generic.or" />
              </Text>
            </Flex>

            <ReferenceRetriever loader={<SwapTrigger.Loader />}>
              <SwapTrigger />
            </ReferenceRetriever>
          </Flex>
        </BlurBackground>
      </Flex>
    </Container>
  );
};
