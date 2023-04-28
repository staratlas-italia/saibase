import { Message } from 'discord.js';
import { AppState } from '../../../state';
import { getTokenBalance } from './getTokenBalance';

export const createOnTokensBalance =
  (message: Message, state: AppState) => async (_: string) => {
    const discordId = message.author.id;
    const user = message.mentions.users.first();

    const { balance, error } = await getTokenBalance(
      user?.id ?? discordId,
      state
    );

    if (error) {
      message.reply({
        content: user
          ? `Cannot find user <@${user.id}>`
          : `User not linked! Link your discord account on https://app.staratlasitalia.com/link?id=${discordId}`,
      });

      return;
    }

    if (user) {
      message.reply({ content: `<@${user.id}> balance is ${balance}C` });

      return;
    }

    message.reply({
      content: `Your current balance is ${balance}C`,
    });
  };
