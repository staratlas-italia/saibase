import { environment } from '@saibase/configuration';

const debug = '973203968530472990';

export const roleIds = {
  citizenship: environment.development
    ? {
        oni: debug,
        mud: debug,
        ustur: debug,
      }
    : {
        oni: '1036660455407628358',
        mud: '1036660690070552649',
        ustur: '1036660839983353987',
      },
  debug,
  dev: '925486121591377983',
  genesis: '969209584877199370',
  ledger: '1052180848671199262',
  team: environment.development ? '935121440787791892' : '917086339378323554',
  tutor: '1059604744982765627',
};

export const permisionLevels = {
  admin: 4,
  dev: 3,
  tutor: 2,
  genesis: 1,
  citizen: 0,
} as const;

export type PermissionLevels = keyof typeof permisionLevels;

export const mapRolePermissionLevels = {
  [roleIds.citizenship.oni]: permisionLevels.citizen,
  [roleIds.citizenship.mud]: permisionLevels.citizen,
  [roleIds.citizenship.ustur]: permisionLevels.citizen,
  [roleIds.genesis]: permisionLevels.genesis,
  [roleIds.tutor]: permisionLevels.tutor,
  [roleIds.dev]: permisionLevels.dev,
  [roleIds.team]: permisionLevels.admin,
} as const;
