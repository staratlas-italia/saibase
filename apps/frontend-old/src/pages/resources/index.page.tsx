import { Flex, Text } from '@saibase/uikit';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Translation } from '../../i18n/Translation';
import { appendQueryParams } from '../../utils/appendQueryParams';
import { fillUrlParameters } from '../../utils/fillUrlParameters';
import { getRoute } from '../../utils/getRoute';
import { useTutorAccounts } from './useResourcesAccounts';

const BadgeBlock = styled(Flex).attrs({
  className:
    'overflow-hidden cursor-pointer max-w-md w-full rounded-2xl transition-all md:hover:scale-105',
})`
  position: relative;
`;

const numberFormatter = new Intl.NumberFormat();

const Tutor = () => {
  const router = useRouter();

  const query = router.query as Record<string, string | number>;

  const { accounts, states } = useTutorAccounts();

  return (
    <>
      <Flex justify="center" pt={48} px={10}>
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
        {(['arco'] as const).map((resource) => {
          const account = accounts[resource];
          const state = states[account];

          return (
            <BadgeBlock
              direction="col"
              key={resource}
              onClick={() =>
                router.push(
                  appendQueryParams(
                    fillUrlParameters(getRoute('/swap/:swapAccount'), {
                      swapAccount: account,
                    }),
                    query
                  )
                )
              }
            >
              {resource}
            </BadgeBlock>
          );
        })}
      </Flex>
    </>
  );
};

export default Tutor;
