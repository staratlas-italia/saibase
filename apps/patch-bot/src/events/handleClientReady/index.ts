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

  if (!commands) {
    logger.log('No command manager available');

    return;
  }

  const allCommands = await client.application?.commands.fetch();

  const commandNames: string[] = availableCommands.map(
    (command) => command.name
  );

  allCommands.forEach(async (command) => {
    state.logger.log('Available command', command.name);

    if (!commandNames.includes(command.name)) {
      state.logger.log('Deleting command', command.name);

      await command.delete();
    }
  });

  for (const command of availableCommands) {
    await commands.create(command);
  }

  logger.log('Discord client is ready!');
};
