import { Flex, Text } from '@saibase/uikit';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Translation } from '../../i18n/Translation';
import { appendQueryParams } from '../../utils/appendQueryParams';
import { fillUrlParameters } from '../../utils/fillUrlParameters';
import { getRoute } from '../../utils/getRoute';
import { useResourcesAccounts } from './useResourcesAccounts';

const TitleWrapper = styled(Flex).attrs({
  className: 'bg-white overflow-hidden divide-y',
})``;

const BadgeBlock = styled(Flex).attrs({
  className:
    'overflow-hidden cursor-pointer max-w-md w-full rounded-2xl transition-all md:hover:scale-105',
})`
  position: relative;
`;

const Resource = () => {
  const router = useRouter();

  const query = router.query as Record<string, string | number>;

  const { accounts } = useResourcesAccounts();

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
              <Flex>
                <img alt={``} src={``} />
              </Flex>

              <TitleWrapper direction="col">
                <Flex direction="col">
                  <Flex direction="col" py={4} px={4} className="md:py-3">
                    <Text size="3xl" weight="semibold"></Text>

                    <Flex pt={2}>
                      <Text size="xl">
                        <Translation
                          id="resource.resourceSelector.pieces"
                          values={{
                            items: 'XXtogetfromedit',
                          }}
                        />
                      </Text>
                    </Flex>
                  </Flex>

                  <Flex direction="col" p={5} className="md:py-3">
                    <Text size="lg">
                      <Translation id="tutor.badgeSelector.whatYouReceive" />
                    </Text>

                    <ul className="list-disc pl-5">
                      <li>{resource}</li>
                    </ul>
                  </Flex>
                </Flex>

                <Flex direction="col" px={6} py={8}>
                  {
                    <Flex direction="col">
                      <Text
                        transform="uppercase"
                        weight="semibold"
                        color="text-gray-400"
                      >
                        <Translation
                          id="resource.resourceSelector.resume"
                          values={{
                            nTokens: '1',
                            quantity: '10',
                          }}
                        />
                        {resource}
                      </Text>
                    </Flex>
                  }
                </Flex>
              </TitleWrapper>
            </BadgeBlock>
          );
        })}
      </Flex>
    </>
  );
};

export default Resource;
