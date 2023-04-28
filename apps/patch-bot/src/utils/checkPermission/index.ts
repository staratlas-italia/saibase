import { environment } from '@saibase/configuration';
import { GuildMember, GuildMemberRoleManager } from 'discord.js';
import { roleIds } from '../../constants/roles';

type Param = {
  author: GuildMember;
};

type Role = 'admin' | 'citizen' | 'dev' | 'genesisHolder' | 'tutor';

export const checkRoles = ({ author }: Param) => {
  const memberRoles: GuildMemberRoleManager = author.roles;

  const roles: Role[] = [];

  if (memberRoles.cache.some((role) => role.id === roleIds.team)) {
    roles.push('admin');
  }

  if (
    environment.development ||
    memberRoles.cache.some((role) => role.id === roleIds.dev)
  ) {
    roles.push('dev');
  }

  if (memberRoles.cache.some((role) => role.id === roleIds.genesis)) {
    roles.push('genesisHolder');
  }

  if (
    memberRoles.cache.some((role) =>
      Object.values(roleIds.citizenship).includes(role.id)
    )
  ) {
    roles.push('citizen');
  }

  if (memberRoles.cache.some((role) => role.id === roleIds.tutor)) {
    roles.push('tutor');
  }

  return {
    isAdmin: roles.includes('admin'),
    isCitizen: roles.includes('citizen'),
    isDev: roles.includes('dev'),
    isGenesisHolder: roles.includes('genesisHolder'),
    isTutor: roles.includes('tutor'),
    isNone: roles.length === 0,
  };
};
