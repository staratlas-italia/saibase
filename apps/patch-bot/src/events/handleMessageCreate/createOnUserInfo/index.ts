import { Message, TextChannel } from 'discord.js';
import { developersChannel } from '../../../constants';
import { AppState } from '../../../state';

export const createUserInfoHandler =
  (message: Message, state: AppState) => async (_: string) => {
    const mentionedUser = message.mentions.users.first();

    const channel =
      (await state.discord.channels.cache.get(developersChannel)) ||
      (await state.discord.channels.fetch(developersChannel));

    if (!mentionedUser) {
      message.reply({ content: 'Invalid parameters supplied' });
      return;
    }

    const usersCollection = state.database.users();
    const transactionsCollection = state.database.transactions();

    const user = await usersCollection.findOne({
      discordId: mentionedUser.id,
    });

    if (!user) {
      message.reply({ content: 'User not linked' });
      return;
    }

    const transactions = await transactionsCollection
      .find({ userId: user._id })
      .toArray();

    (channel as TextChannel).send({
      content: JSON.stringify({ ...user, transactions }, null, 2),
    });
  };
