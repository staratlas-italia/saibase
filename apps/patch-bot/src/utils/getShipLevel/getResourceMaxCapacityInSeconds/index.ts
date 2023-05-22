import { ShipStakingInfoExtended } from '@saibase/star-atlas';
import { match } from 'ts-pattern';
import { Resource } from '../../../types';

export const getResourceMaxCapacityInSeconds = (
  ship: ShipStakingInfoExtended,
  resource: Resource
) =>
  match(resource)
    .with('ammo', () => ship.armsCurrentCapacity)
    .with('food', () => ship.foodCurrentCapacity)
    .with('fuel', () => ship.fuelCurrentCapacity)
    .with('tools', () => ship.healthCurrentCapacity)
    .exhaustive();
