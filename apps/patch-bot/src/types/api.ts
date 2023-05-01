import { ShipStakingInfoExtended } from '@saibase/star-atlas';

export type ScoreFleetResponse =
  | {
      success: false;
      error: string;
    }
  | {
      success: true;
      data: ShipStakingInfoExtended[];
    };
