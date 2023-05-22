import { ShipStakingInfoExtended } from '@saibase/star-atlas';
import { match } from 'ts-pattern';
import { Resource } from '../../../types';
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
  ship: ShipStakingInfoExtended,
  secondsSinceLastRefill: number = getSecondsSinceLastRefill(
    ship.currentCapacityTimestamp
  )
): number =>
  /*
   * armsCurrentCapacity, foodCurrentCapacity, fuelCurrentCapacity, healthCurrentCapacity
   * sono i secondi prima che una delle risorse finisca dopo l'ultimo refill effettuato.
   * Questo valore cambia solo quando si fa il refill di una o più risorse ed è calcolato in
   * base alla quantità di risorse immesse
   * */
  match(resource)
    .with('ammo', () => ship.armsCurrentCapacity - secondsSinceLastRefill)
    .with('food', () => ship.foodCurrentCapacity - secondsSinceLastRefill)
    .with('fuel', () => ship.fuelCurrentCapacity - secondsSinceLastRefill)
    .with('tools', () => ship.healthCurrentCapacity - secondsSinceLastRefill)
    .exhaustive();
