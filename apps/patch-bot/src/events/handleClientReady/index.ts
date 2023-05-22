import { Client } from 'discord.js';
import { availableCommands } from '../../commands';
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

  commands?.permissions.set;

  if (!commands) {
    logger.log('No command manager available');

    return;
  }

  for (const command of commands.cache.values()) {
    await command.delete();
  }

  for (const command of availableCommands) {
    await commands.create(command);
  }

  logger.log('Discord client is ready!');
};
