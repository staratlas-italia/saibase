import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { push } from '../../../commands/push';
import { AppState } from '../../../state';
import { PushCommandStatus } from '../../../types';
import { withPermissions } from '../../../utils/withPermissions';

const handlePushCommandHandler = async ({
  state,
  interaction,
}: {
  state: AppState;
  interaction: ChatInputCommandInteraction;
}) => {
  await interaction.deferReply({ ephemeral: true });

  const usersCollection = state.database.users();

  const user = await usersCollection.findOne({
    discordId: (interaction.member as GuildMember).user.id,
  });

  const status = interaction.options.getString(
    'status',
    true
  ) as PushCommandStatus;

  const replyMessage = await push({ user, status }, state);

  interaction.editReply({
    content: replyMessage,
  });
};

export const handlePushCommand = withPermissions(
  handlePushCommandHandler,
  'genesis'
);
