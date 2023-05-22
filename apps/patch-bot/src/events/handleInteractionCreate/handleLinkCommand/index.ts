import { parsePublicKey } from '@saibase/web3';
import { ChatInputCommandInteraction } from 'discord.js';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { AppState } from '../../../state';
import { withPermissions } from '../../../utils/withPermissions';

const handleLinkCommandHandler = async ({
  state,
  interaction,
}: {
  interaction: ChatInputCommandInteraction;
  state: AppState;
}) => {
  await interaction.deferReply({ ephemeral: true });

  const mentionedUser = interaction.options.getUser('user', true);
  const publicKeyString = interaction.options.getString('public-key', true);

  pipe(
    parsePublicKey(publicKeyString),
    E.fold(
      () => {
        interaction.editReply({
          content: 'The <publicKey> param should be a valid PublicKey!',
        });
      },
      async (publicKey) => {
        const usersCollection = state.database.users();

        const user = await usersCollection.findOne({
          wallets: publicKey.toString(),
        });

        if (!user) {
          interaction.editReply({
            content: 'Cannot find user with this pubkey.',
          });

          return;
        }

        if (user.discordId) {
          interaction.editReply({
            content: 'User is already linked.',
          });

          return;
        }

        await usersCollection.updateOne(
          { _id: user._id },
          { discordId: mentionedUser.id }
        );

        interaction.editReply({
          content: `🚀 Great! User linked successfully!`,
        });
      }
    )
  );
};

export const handleLinkCommand = withPermissions(
  handleLinkCommandHandler,
  'dev'
);
