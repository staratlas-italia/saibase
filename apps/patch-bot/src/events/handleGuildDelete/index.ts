import { Guild } from 'discord.js';
import { logger } from '../../logger';
import { AppState } from '../../state';

export const handleGuildDelete = async (guild: Guild, state: AppState) => {
  const botGuild = await state.database
    .guilds()
    .findOne({ serverId: guild.id });

  if (botGuild) {
    logger.log(`Storgin guild ${guild.name}`);

    state.database.guilds().deleteOne({
      serverId: guild.id,
    });
  }
};
