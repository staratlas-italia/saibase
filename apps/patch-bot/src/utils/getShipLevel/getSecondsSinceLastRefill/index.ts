/**
 *
 * @param lastRefillInSeconds: ultima volta che hai fatto refill
 * (qualsiasi quantità) di una o più risorse di una nave in secondi
 *
 * @returns the seconds between now and the last refill
 */
export const getSecondsSinceLastRefill = (
  lastRefillInSeconds: number
): number => {
  const now = Date.now() / 1000;

  return now - lastRefillInSeconds;
};
