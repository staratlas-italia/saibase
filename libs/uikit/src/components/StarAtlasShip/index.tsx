import type {
  ShipStakingInfoExtended,
  StarAtlasNft,
} from '@saibase/star-atlas';
import { default as NextImage } from 'next/image';
import { Card } from '../Card';
import { Countdown } from '../Countdown';
import { Flex } from '../Flex';
import { Progress } from '../Progress';
import { Text } from '../Text';
import { TextColor } from '../Text/types';
import { Description } from './components/Description';
import { Heading } from './components/Heading';

type Props = {
  ship?: StarAtlasNft;
  stakeInfo?: ShipStakingInfoExtended;
  bottomContent?: React.ReactNode;
  showDesc?: boolean;
};

const shipColors: { [key: string]: TextColor } = {
  'xx-small': 'text-white',
  'x-small': 'text-indigo-300',
  small: 'text-yellow-500',
  medium: 'text-emerald-500',
  large: 'text-pink-600',
  capital: 'text-purple-400',
  commander: 'text-red-600',
  titan: 'text-emerald-400',
};

export const StarAtlasShip = ({
  ship,
  stakeInfo,
  bottomContent = null,
  showDesc,
}: Props) => {
  if (!ship) {
    return null;
  }

  return (
    <Card border direction="col">
      <div className="rounded-t-2xl overflow-hidden relative h-56">
        <NextImage
          src={ship?.image}
          alt={ship?.name}
          fill
          quality={20}
          className=" object-cover"
        />
      </div>

      <Flex
        grow={1}
        direction="col"
        py={12}
        px={6}
        mdPy={10}
        mdPx={8}
        className="w-full"
      >
        <Flex grow={1} direction="col">
          <Heading
            color={shipColors[ship?.attributes?.class?.toLowerCase()]}
            title={ship?.name}
            subtitle={ship?.attributes?.class}
          />

          {showDesc && (
            <Flex py={2}>
              <Description text={ship.description} />
            </Flex>
          )}

          {stakeInfo && (
            <div className="w-full mt-3 sm:mt-5 sm:mx-auto md:mt-5 lg:mx-0">
              <Flex direction="row" className="w-full">
                <Flex justify="start" align="center">
                  <NextImage
                    alt="Rocket"
                    width={20}
                    height={20}
                    src={`/images/icons/rocket-solid.svg`}
                    className="text-white"
                  />

                  <Text
                    color="text-white"
                    weight="semibold"
                    size="xl"
                    className="ml-2"
                  >
                    {stakeInfo?.shipQuantityInEscrow}
                  </Text>
                </Flex>
              </Flex>

              <Flex py={3} direction="col" className="space-y-4">
                <Progress
                  title={
                    <>
                      {'health'} -{' '}
                      <Countdown
                        date={
                          Date.now() +
                          Math.floor(
                            (stakeInfo?.millisecondsToBurnOneToolkit || 0) *
                              ((stakeInfo?.toolkitMaxReserve || 0) -
                                (new Date().getTime() -
                                  (stakeInfo?.repairedAtTimestamp || 0) *
                                    1000) /
                                  (stakeInfo?.millisecondsToBurnOneToolkit ||
                                    1))
                          )
                        }
                      />
                    </>
                  }
                  max={stakeInfo?.toolkitMaxReserve || 1}
                  level={
                    (stakeInfo?.toolkitMaxReserve || 0) -
                    (new Date().getTime() -
                      (stakeInfo?.repairedAtTimestamp || 0) * 1000) /
                      (stakeInfo?.millisecondsToBurnOneToolkit || 1)
                  }
                />
                <Progress
                  title={
                    <>
                      {'fuel'} -{' '}
                      <Countdown
                        date={
                          Date.now() +
                          Math.floor(
                            (stakeInfo?.millisecondsToBurnOneFuel || 0) *
                              ((stakeInfo?.fuelMaxReserve || 0) -
                                (new Date().getTime() -
                                  (stakeInfo?.repairedAtTimestamp || 0) *
                                    1000) /
                                  (stakeInfo?.millisecondsToBurnOneFuel || 1))
                          )
                        }
                      />
                    </>
                  }
                  max={stakeInfo?.fuelMaxReserve || 1}
                  level={
                    (stakeInfo?.fuelMaxReserve || 0) -
                    (new Date().getTime() -
                      (stakeInfo?.fueledAtTimestamp || 0) * 1000) /
                      (stakeInfo?.millisecondsToBurnOneFuel || 1)
                  }
                />
                <Progress
                  title={
                    <>
                      {'food'} -{' '}
                      <Countdown
                        date={
                          Date.now() +
                          Math.floor(
                            (stakeInfo?.millisecondsToBurnOneFood || 0) *
                              ((stakeInfo?.foodMaxReserve || 0) -
                                (new Date().getTime() -
                                  (stakeInfo?.repairedAtTimestamp || 0) *
                                    1000) /
                                  (stakeInfo?.millisecondsToBurnOneFood || 1))
                          )
                        }
                      />
                    </>
                  }
                  max={stakeInfo?.foodMaxReserve || 1}
                  level={
                    (stakeInfo?.foodMaxReserve || 0) -
                    (new Date().getTime() -
                      (stakeInfo?.fedAtTimestamp || 0) * 1000) /
                      (stakeInfo?.millisecondsToBurnOneFood || 1)
                  }
                />
                <Progress
                  title={
                    <>
                      {'ammo'} -{' '}
                      <Countdown
                        date={
                          Date.now() +
                          Math.floor(
                            (stakeInfo?.millisecondsToBurnOneArms || 0) *
                              ((stakeInfo?.armsMaxReserve || 0) -
                                (new Date().getTime() -
                                  (stakeInfo?.repairedAtTimestamp || 0) *
                                    1000) /
                                  (stakeInfo?.millisecondsToBurnOneArms || 1))
                          )
                        }
                      />
                    </>
                  }
                  max={stakeInfo?.armsMaxReserve || 1}
                  level={
                    (stakeInfo?.armsMaxReserve || 0) -
                    (new Date().getTime() -
                      (stakeInfo?.armedAtTimestamp || 0) * 1000) /
                      (stakeInfo?.millisecondsToBurnOneArms || 1)
                  }
                />
              </Flex>
            </div>
          )}
        </Flex>

        <div className="pt-2">{bottomContent}</div>
      </Flex>
    </Card>
  );
};
