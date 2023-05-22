import { ChatInputCommandInteraction } from 'discord.js';
import { AppState } from '../../../state';
import { withPermissions } from '../../../utils/withPermissions';

const handleSendCommandHandler = async ({
  state,
  interaction,
}: {
  interaction: ChatInputCommandInteraction;
  state: AppState;
}) => {
  await interaction.deferReply({ ephemeral: true });

  const mentionedUser = interaction.options.getUser('user', true);
  const amount = interaction.options.getNumber('amount', true);

  const usersCollection = state.database.users();
  const userTokensCollection = state.database.userTokens();

  const user = await usersCollection.findOne({
    discordId: mentionedUser.id,
  });

  const payer = await usersCollection.findOne({
    discordId: interaction.member?.user.id,
  });

  if (payer?._id && user?._id.equals(payer?._id)) {
    interaction.editReply({ content: `You cannot pay yourself!` });

    return;
  }

  if (!user) {
    interaction.editReply({ content: `User <@${mentionedUser.id}> not found` });

    return;
  }

  await userTokensCollection.insertOne({
    amount: Number(amount),
    createdAt: new Date(),
    userId: user._id,
    payerId: payer?._id,
    currency: 'C',
  });

  interaction.editReply({
    content: `Great! <@${mentionedUser.id}> has now +${amount}C`,
  });
};

export const handleSendCommand = withPermissions(
  handleSendCommandHandler,
  'dev'
);
