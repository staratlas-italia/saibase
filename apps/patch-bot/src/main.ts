import { environment, environmentName } from '@saibase/configuration';
import * as Sentry from '@sentry/node';
import { Events } from 'discord.js';
import dotenv from 'dotenv';
import 'isomorphic-fetch';
import { discordBotToken } from './constants';
import { handleClientReady } from './events/handleClientReady';
import { handleGuildCreate } from './events/handleGuildCreate';
import { handleGuildDelete } from './events/handleGuildDelete';
import { handleInteractionCreate } from './events/handleInteractionCreate';
import { handleMessageCreate } from './events/handleMessageCreate';
import {
  createRefillCheckJobHandler,
  createTakeFleetSnapshopshotJobHandler,
  createUpdateDiscordRoleHandler,
  fetchFeatureFlags,
} from './jobs';
import { state } from './state';
import { Job } from './state/Job';

dotenv.config();

if (environment.production) {
  Sentry.init({
    environment: environmentName,
    dsn: process.env.SENTRY_URL,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

const jobs = [
  new Job('feature-flags', '* */1 * * *', fetchFeatureFlags),
  new Job(
    'fleet-snapshot',
    '0 1 * * *',
    createTakeFleetSnapshopshotJobHandler(state)
  ),
  new Job('fleet-refill', '0 */1 * * *', createRefillCheckJobHandler(state)),
  new Job(
    'update-discord-roles',
    '*/10 * * * *',
    createUpdateDiscordRoleHandler(state)
  ),
];

const run = async () => {
  try {
    await fetchFeatureFlags('root');

    state.discord.on(Events.ClientReady, (client) => {
      handleClientReady(client, state);
    });

    state.discord.on(Events.InteractionCreate, (interaction) => {
      handleInteractionCreate(interaction, state);
    });

    state.discord.on(Events.MessageCreate, (message) => {
      handleMessageCreate(message, state);
    });

    state.discord.on(Events.GuildCreate, (guild) => {
      handleGuildCreate(guild, state);
    });

    state.discord.on(Events.GuildDelete, (guild) => {
      handleGuildDelete(guild, state);
    });

    await state.discord.login(discordBotToken);

    jobs.forEach((job) => job.start());
  } catch (e) {
    Sentry.captureException(e, { level: 'error' });
  }
};

process.on('SIGINT', async () => {
  process.exit(0);
});

run();
