import { NormalizedShipStakingInfoExtended, Resource } from '../../types';
import { getPassedTimeSinceLastRefillInSeconds } from './getPassedTimeSinceLastRefillInSeconds';
import { getResourceRemainingPercentage } from './getResourceRemainingPercentage';

export const getShipLevel = (
  ship: NormalizedShipStakingInfoExtended,
  resource: Resource
) =>
  getResourceRemainingPercentage(
    ship,
    resource,
    getPassedTimeSinceLastRefillInSeconds(ship)
  );
