import { ChatInputCommandInteraction } from 'discord.js';
import { AppState } from '../../../state';
import { withPermissions } from '../../../utils/withPermissions';

const handleUnlinkCommandHandler = async ({
  state,
  interaction,
}: {
  interaction: ChatInputCommandInteraction;
  state: AppState;
}) => {
  await interaction.deferReply({ ephemeral: true });

  const mentionedUser = interaction.options.getUser('user', true);

  const usersCollection = state.database.users();

  const user = await usersCollection.findOne({
    discordId: mentionedUser.id,
  });

  if (!user) {
    interaction.editReply({
      content: 'Cannot find this user.',
    });

    return;
  }

  if (!user.discordId) {
    interaction.editReply({
      content: 'User is already unlinked',
    });

    return;
  }

  await usersCollection.updateOne({ _id: user._id }, { discordId: null });

  interaction.editReply({
    content: `Great! User unlinked successfully!`,
  });
};

export const handleUnlinkCommand = withPermissions(
  handleUnlinkCommandHandler,
  'dev'
);
