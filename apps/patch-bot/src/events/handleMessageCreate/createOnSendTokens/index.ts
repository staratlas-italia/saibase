import { Message } from 'discord.js';
import { AppState } from '../../../state';

export const createSendTokensHandler =
  (message: Message, state: AppState) => async (_: string, amount: string) => {
    const mentionedUser = message.mentions.users.first();

    if (!mentionedUser || !amount) {
      message.reply({ content: 'Invalid parameters supplied' });
      return;
    }

    if (!Number(amount)) {
      message.reply({ content: 'The <amount> param should be a number!' });
      return;
    }

    const usersCollection = state.database.users();
    const userTokensCollection = state.database.userTokens();

    const user = await usersCollection.findOne({
      discordId: mentionedUser.id,
    });

    const payer = await usersCollection.findOne({
      discordId: message.author.id,
    });

    if (payer?._id && user?._id.equals(payer?._id)) {
      message.reply({ content: `You cannot pay yourself!` });

      return;
    }

    if (!user) {
      message.reply({ content: `User <@${mentionedUser.id}> not found` });

      return;
    }

    await userTokensCollection.insertOne({
      amount: Number(amount),
      createdAt: new Date(),
      userId: user._id,
      payerId: payer?._id,
      currency: 'C',
    });

    message.reply({
      content: `Great! <@${mentionedUser.id}> has now +${amount}C`,
    });
  };
