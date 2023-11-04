import Image from "next/image";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Text } from "~/components/common/Text";
import { BlurBackground } from "~/components/layout/BlurBackground";
import { Flex } from "~/components/layout/Flex";
import { Translation } from "~/i18n/Translation";
import { appendQueryParams } from "~/utils/appendQueryParams";
import { fillUrlParameters } from "~/utils/fillUrlParameters";
import { getRoute } from "~/utils/getRoute";
import { useRewardsAccounts } from "./useRewardsAccounts";

const RewardsBlock = styled(BlurBackground).attrs({
  p: 5,
  direction: "col",
  className:
    "overflow-hidden md:overflow-visible cursor-pointer max-w-md w-full aspect-square md:aspect-auto",
})`
  position: relative;
`;

const RewardsSymbol = styled(Flex).attrs({
  direction: "col",
})`
  position: absolute;
  bottom: 32px;
  left: 32px;
`;

const RewardsImage = styled.img.attrs({
  className:
    "md:opacity-60 md:hover:opacity-100 transition-all md:hover:scale-110",
})``;

const Rewards = () => {
  const router = useRouter();

  const query = router.query as Record<string, string | number>;

  const accounts = useRewardsAccounts();

  return (
    <>
      <Flex justify="center" pt={48} px={10}>
        <Text align="center" color="text-white" size="6xl" weight="bold" shadow>
          <Translation id="Rewards.rewardsSelector.title" />
        </Text>
      </Flex>

      <Flex
        className="space-y-5 md:space-y-0 md:space-x-5"
        direction="col"
        mdDirection="row"
        align="center"
        justify="center"
        p={8}
      >
          //Multiple choices

        <RewardsBlock
          onClick={() =>
            router.push(
              appendQueryParams(
                fillUrlParameters(getRoute("/swap/:swapAccount"), {
                  swapAccount: accounts.mud,
                }),
                query
              )
            )
          }
        >
          <RewardsImage alt="Mud" src="/images/factions/mud_big.webp" />

          <RewardsSymbol>
            <Flex align="center" direction="col">
              <Image
                width={96}
                height={96}
                alt="Mud Symbol"
                src="/images/factions/mud.svg"
              />
              <Text color="text-white" size="4xl">
                MUD
              </Text>
            </Flex>
          </RewardsSymbol>
        </RewardsBlock>
      </Flex>
    </>
  );
};

export default Rewards;
