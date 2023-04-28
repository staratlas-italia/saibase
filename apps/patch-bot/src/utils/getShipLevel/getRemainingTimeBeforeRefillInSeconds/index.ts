import { NormalizedShipStakingInfoExtended, Resource } from '../../../types';
import { assertNever } from '../../assertNever';
import { getSecondsSinceLastRefill } from '../getSecondsSinceLastRefill';

/**
 * Tempo rimasto in secondi prima di dover fare nuovamente il refill di una specifica risorsa
 *
 * @param resource
 * @param ship
 * @param _timePass
 * @returns the remaining time before refill in seconds
 */
export const getRemainingTimeBeforeRefillInSeconds = (
  resource: Resource,
  ship: NormalizedShipStakingInfoExtended,
  secondsSinceLastRefill: number = getSecondsSinceLastRefill(
    ship.currentCapacityTimestamp
  )
): number => {
  /*
   * armsCurrentCapacity, foodCurrentCapacity, fuelCurrentCapacity, healthCurrentCapacity
   * sono i secondi prima che una delle risorse finisca dopo l'ultimo refill effettuato.
   * Questo valore cambia solo quando si fa il refill di una o più risorse ed è calcolato in
   * base alla quantità di risorse immesse
   * */
  switch (resource) {
    case 'ammo':
      return ship.armsCurrentCapacity - secondsSinceLastRefill;
    case 'food':
      return ship.foodCurrentCapacity - secondsSinceLastRefill;
    case 'fuel':
      return ship.fuelCurrentCapacity - secondsSinceLastRefill;
    case 'tools':
      return ship.healthCurrentCapacity - secondsSinceLastRefill;
    default:
      return assertNever(resource);
  }
};
