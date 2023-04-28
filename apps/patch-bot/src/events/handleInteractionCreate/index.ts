import { GuildMember, Interaction, TextChannel } from 'discord.js';
import { push } from '../../commands/push';
import { referral } from '../../commands/referral';
import { logger } from '../../logger';
import { AppState } from '../../state';
import { PushCommandStatus } from '../../types';
import { checkRoles } from '../../utils/checkPermission';

export const handleInteractionCreate = async (
  interaction: Interaction,
  state: AppState
) => {
  if (!interaction.isChatInputCommand()) {
    logger.error('Command not found');

    return;
  }

  const { commandName, options } = interaction;

  const author: GuildMember = interaction.member as GuildMember;

  if (!author) {
    logger.error('Author who interacted is invalid');

    return;
  }

  const { isNone } = checkRoles({
    author,
  });

  const memberDiscordId = author.user.id;

  if (!memberDiscordId) {
    logger.error(`Invalid discord id ${memberDiscordId}`);

    return;
  }

  switch (commandName) {
    case 'push': {
      if (isNone) {
        interaction.reply({
          content:
            "Non hai l'autorizzazione necessaria per lanciare questo comando",
        });
        return;
      }

      // Consent to reply in ..1../5 minutes instead of 3 seconds
      await interaction.deferReply({ ephemeral: true });

      const usersCollection = state.database.users();

      const user = await usersCollection.findOne({
        discordId: memberDiscordId,
      });

      const status = options.getString('status') as PushCommandStatus;

      const replyMessage = await push({ user, status }, state);

      interaction.editReply({
        content: replyMessage,
      });
      break;
    }

    case 'referral': {
      // Consent to reply in ..1../5 minutes instead of 3 seconds
      await interaction.deferReply({ ephemeral: true });

      const replyMessage = await referral({
        channel: interaction.channel as TextChannel,
      });

      interaction.editReply({
        content: replyMessage,
      });
      break;
    }

    default: {
      interaction.reply({
        content: 'Il comando non è valido',
      });
    }
  }
};
