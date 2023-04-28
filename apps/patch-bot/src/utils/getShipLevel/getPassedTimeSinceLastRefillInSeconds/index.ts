import { NormalizedShipStakingInfoExtended } from '../../../types';
import { getRemainingTimeBeforeRefillInSeconds } from '../getRemainingTimeBeforeRefillInSeconds';
import { getSecondsSinceLastRefill } from '../getSecondsSinceLastRefill';

export const getPassedTimeSinceLastRefillInSeconds = (
  ship: NormalizedShipStakingInfoExtended
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
