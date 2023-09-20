import * as t from 'io-ts';

export const sageShipStatsCodec = t.type({
  mint: t.string,
  class: t.number,
  lp: t.number,
  cargoCapacity: t.number,
  fuelCapacity: t.number,
  ammoCapacity: t.number,
  miningFoodPerSecond: t.number,
  miningAmmoPerSecond: t.number,
  miningResourcesPerSecond: t.number,
  subwarpSpeed: t.number,
  warpSpeed: t.number,
  maxWarpDistance: t.number,
  baseWarpCooldown: t.number,
  fuelAuWarped: t.number,
  fuelAUSubwarp: t.number,
  fuelAsteroidExit: t.number,
  scanCooldownSeconds: t.number,
  foodCrew: t.number,
  craftingActiveCrew: t.number,
  respawnTime: t.number,
  foodScan: t.number,
});

export type SageShipStats = t.TypeOf<typeof sageShipStatsCodec>;
