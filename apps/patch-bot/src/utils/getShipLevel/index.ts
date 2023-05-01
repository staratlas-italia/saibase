import { ShipStakingInfoExtended } from '@saibase/star-atlas';
import { Resource } from '../../types';
import { getPassedTimeSinceLastRefillInSeconds } from './getPassedTimeSinceLastRefillInSeconds';
import { getResourceRemainingPercentage } from './getResourceRemainingPercentage';

export const getShipLevel = (
  ship: ShipStakingInfoExtended,
  resource: Resource
) =>
  getResourceRemainingPercentage(
    ship,
    resource,
    getPassedTimeSinceLastRefillInSeconds(ship)
  );
