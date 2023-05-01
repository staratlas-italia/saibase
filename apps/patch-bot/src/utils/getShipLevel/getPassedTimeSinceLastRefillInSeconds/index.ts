import { ShipStakingInfoExtended } from '@saibase/star-atlas';
import { getRemainingTimeBeforeRefillInSeconds } from '../getRemainingTimeBeforeRefillInSeconds';
import { getSecondsSinceLastRefill } from '../getSecondsSinceLastRefill';

export const getPassedTimeSinceLastRefillInSeconds = (
  ship: ShipStakingInfoExtended
) => {
  const secondsSinceLastRefill = getSecondsSinceLastRefill(
    ship.currentCapacityTimestamp
  );

  const firstResourceRemainingTimeBeforeRefillInSeconds = Math.min(
    getRemainingTimeBeforeRefillInSeconds('food', ship),
    getRemainingTimeBeforeRefillInSeconds('ammo', ship),
    getRemainingTimeBeforeRefillInSeconds('fuel', ship),
    getRemainingTimeBeforeRefillInSeconds('tools', ship)
  );

  /**
   * If the remaing time is in the past (it needs to refill),
   * let's remove the passed time from the result
   */
  if (firstResourceRemainingTimeBeforeRefillInSeconds < 0) {
    return (
      secondsSinceLastRefill -
      Math.abs(firstResourceRemainingTimeBeforeRefillInSeconds)
    );
  }

  return secondsSinceLastRefill;
};
