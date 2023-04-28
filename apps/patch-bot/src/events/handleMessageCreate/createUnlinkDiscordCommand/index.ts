import { Message } from 'discord.js';
import { AppState } from '../../../state';

export const createUnlinkDiscordCommandHandler =
  (message: Message, state: AppState) => async (_: string) => {
    const mentionedUser = message.mentions.users.first();

    if (!mentionedUser) {
      message.reply({ content: 'Invalid parameters supplied' });

      return;
    }

    const usersCollection = state.database.users();

    const user = await usersCollection.findOne({
      discordId: mentionedUser.id,
    });

    if (!user) {
      message.reply({
        content: 'Cannot find this user.',
      });

      return;
    }

    if (!user.discordId) {
      message.reply({
        content: 'User is already unlinked',
      });

      return;
    }

    await usersCollection.updateOne({ _id: user._id }, { discordId: null });

    message.reply({
      content: `Great! User unlinked successfully!`,
    });
  };
