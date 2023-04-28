import { ApplicationCommandOptionType, Client } from 'discord.js';
import { logger } from '../../logger';
import { AppState } from '../../state';

export const handleClientReady = async (
  client: Client<true>,
  state: AppState
) => {
  const guildsCollection = state.database.guilds();

  await Promise.all(
    client.guilds.cache.map(async (guild) => {
      const currentGuild = await guildsCollection.findOne({
        serverId: guild.id,
      });

      if (!currentGuild) {
        logger.info(
          `Guild "${guild.name}" not found, adding it to the database`
        );

        await guildsCollection.insertOne({
          serverId: guild.id,
          serverName: guild.name,
          ownerId: guild.ownerId,
        });
      }
    })
  );

  const commands = state.discord.application?.commands;

  if (!commands) {
    logger.log('No command manager available');

    return;
  }

  commands.create({
    name: 'push',
    description: 'Refill push notifications',
    options: [
      {
        name: 'status',
        description: 'on/off',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  });

  commands.create({
    name: 'referral',
    description: 'Get referral server link',
  });

  logger.log('Discord client is ready!');
};
