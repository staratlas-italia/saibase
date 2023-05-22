import { ChatInputCommandInteraction } from 'discord.js';
import { AppState } from '../../../state';
import { withPermissions } from '../../../utils/withPermissions';

const handleUserInfoHandler = async ({
  state,
  interaction,
}: {
  state: AppState;
  interaction: ChatInputCommandInteraction;
}) => {
  await interaction.deferReply({ ephemeral: true });

  const mentionedUser = interaction.options.getUser('user', true);

  const usersCollection = state.database.users();

  const user = await usersCollection.findOne({
    discordId: mentionedUser.id,
  });

  if (!user) {
    await interaction.editReply({ content: 'User not linked' });

    return;
  }

  interaction.editReply({
    content: JSON.stringify(user, null, 2),
  });
};

export const handleUserInfo = withPermissions(handleUserInfoHandler, 'dev');
