import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { PermissionLevels } from '../../constants/roles';
import { AppState } from '../../state';
import { isAuthorized } from '../isAuthorized';

export const withPermissions =
  <
    T extends {
      state: AppState;
      interaction: ChatInputCommandInteraction;
    }
  >(
    fn: (_: T) => unknown,
    permission: PermissionLevels
  ) =>
  ({ interaction, state, ...params }: T) => {
    const author = interaction.member as GuildMember;

    if (isAuthorized({ author, permission })) {
      return fn({ state, interaction, ...params } as T);
    }

    return () => {
      interaction.reply({
        ephemeral: true,
        content: 'You do not have permission to use this command',
      });
    };
  };
