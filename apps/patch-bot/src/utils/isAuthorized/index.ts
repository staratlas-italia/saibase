import { GuildMember, GuildMemberRoleManager } from 'discord.js';
import {
  PermissionLevels,
  mapRolePermissionLevels,
  permisionLevels,
} from '../../constants/roles';

type Param = {
  author: GuildMember;
};

export type Role = 'admin' | 'citizen' | 'dev' | 'genesisHolder' | 'tutor';

export const isAuthorized = ({
  author,
  permission,
}: Param & { permission: PermissionLevels }) => {
  const memberRoles: GuildMemberRoleManager = author.roles;

  const permissionLevel = Math.max(
    ...memberRoles.cache.map((role) => mapRolePermissionLevels[role.id] || -1)
  );

  return permissionLevel >= permisionLevels[permission];
};
