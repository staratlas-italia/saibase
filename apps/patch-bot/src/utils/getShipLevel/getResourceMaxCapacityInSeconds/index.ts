import { NormalizedShipStakingInfoExtended, Resource } from '../../../types';
import { assertNever } from '../../assertNever';

export const getResourceMaxCapacityInSeconds = (
  ship: NormalizedShipStakingInfoExtended,
  resource: Resource
) => {
  switch (resource) {
    case 'ammo':
      return ship.armsCurrentCapacity;
    case 'food':
      return ship.foodCurrentCapacity;
    case 'fuel':
      return ship.fuelCurrentCapacity;
    case 'tools':
      return ship.healthCurrentCapacity;
    default:
      return assertNever(resource);
  }
};
