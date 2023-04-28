import { parsePublicKey } from '@saibase/web3';
import { Message } from 'discord.js';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { AppState } from '../../../state';

export const createLinkDiscordCommandHandler =
  (message: Message, state: AppState) =>
  async (_: string, publicKeyString: string) => {
    const mentionedUser = message.mentions.users.first();

    if (!mentionedUser || !publicKeyString) {
      message.reply({ content: 'Invalid parameters supplied' });

      return;
    }

    pipe(
      parsePublicKey(publicKeyString),
      E.fold(
        () => {
          message.reply({
            content: 'The <publicKey> param should be a valid PublicKey!',
          });
        },
        async (publicKey) => {
          const usersCollection = state.database.users();

          const user = await usersCollection.findOne({
            wallets: publicKey.toString(),
          });

          if (!user) {
            message.reply({
              content: 'Cannot find user with this pubkey.',
            });

            return;
          }

          if (user.discordId) {
            message.reply({
              content: 'User is already linked.',
            });

            return;
          }

          await usersCollection.updateOne(
            { _id: user._id },
            { discordId: mentionedUser.id }
          );

          message.reply({
            content: `🚀 Great! User linked successfully!`,
          });
        }
      )
    );
  };
