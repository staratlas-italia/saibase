import { ChatInputCommandInteraction } from 'discord.js';
import { AppState } from '../../../state';
import { getTokenBalance } from './getTokenBalance';

export const handleBalanceCommand = async ({
  interaction,
  state,
}: {
  interaction: ChatInputCommandInteraction;
  state: AppState;
}) => {
  await interaction.deferReply({ ephemeral: true });

  const discordId = interaction.member?.user.id;
  const user = interaction.options.getUser('user');

  if (!discordId) {
    interaction.editReply({
      content: 'Invalid discord id',
    });

    return;
  }

  const { balance, error } = await getTokenBalance(
    user?.id ?? discordId,
    state
  );

  if (error) {
    interaction.editReply({
      content: user
        ? `Cannot find user <@${user.id}>`
        : `User not linked! Link your discord account on https://app.staratlasitalia.com/link?id=${discordId}`,
    });

    return;
  }

  if (user) {
    interaction.editReply({ content: `<@${user.id}> balance is ${balance}C` });

    return;
  }

  interaction.editReply({
    content: `Your current balance is ${balance}C`,
  });
};
