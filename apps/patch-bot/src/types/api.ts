import { NormalizedShipStakingInfoExtended } from '.';

export type ScoreFleetResponse =
  | {
      success: false;
      error: string;
    }
  | {
      success: true;
      data: NormalizedShipStakingInfoExtended[];
    };
