import { ShipStakingInfoExtended } from '@saibase/star-atlas';
import { Resource } from '../../../types';
import { getRemainingTimeBeforeRefillInSeconds } from '../getRemainingTimeBeforeRefillInSeconds';
import { getResourceMaxCapacityInSeconds } from '../getResourceMaxCapacityInSeconds';

export const getResourceRemainingPercentage = (
  ship: ShipStakingInfoExtended,
  resource: Resource,
  timePassSinceStart: number
): number => {
  const resourceMaxCapacityInSeconds = getResourceMaxCapacityInSeconds(
    ship,
    resource
  );

  const remainingTimeBeforeRefillInSeconds =
    getRemainingTimeBeforeRefillInSeconds(resource, ship, timePassSinceStart);

  return (
    (remainingTimeBeforeRefillInSeconds * 100) / resourceMaxCapacityInSeconds
  );
};
