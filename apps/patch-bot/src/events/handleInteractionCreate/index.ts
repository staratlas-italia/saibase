import { appVersion, environment } from '@saibase/configuration';
import { GuildMember, Interaction } from 'discord.js';
import { match } from 'ts-pattern';
import { CommandName } from '../../commands';
import { AppState } from '../../state';
import { handleBalanceCommand } from './handleBalanceCommand';
import { handleLinkCommand } from './handleLinkCommand';
import { handlePushCommand } from './handlePushCommand';
import { handleSendCommand } from './handleSendCommand';
import { handleSnapshotCommand } from './handleSnapshotCommand';
import { handleStakeCommand } from './handleStakeCommand';
import { handleUnlinkCommand } from './handleUnlinkCommand';
import { handleUserInfo } from './handleUserInfo';

export const handleInteractionCreate = async (
  interaction: Interaction,
  state: AppState
) => {
  if (!interaction.isChatInputCommand()) {
    state.logger.error('Command not found');

    return;
  }

  const { commandName: commandNameUntyped } = interaction;

  const author: GuildMember = interaction.member as GuildMember;

  if (!author) {
    state.logger.error('Author who interacted is invalid');

    return;
  }

  state.logger.info(`Command name: ${commandNameUntyped} ${author.nickname}`);

  const memberDiscordId = author.user.id;

  if (!memberDiscordId) {
    state.logger.error(`Invalid discord id ${memberDiscordId}`);

    return;
  }

  const commandName = commandNameUntyped as CommandName;

  match({ commandName, interaction, state })
    // .with({ commandName: 'config' }, () => {
    //   state.logger.info('Config command');

    //   const subcommand = interaction.options.getSubcommand();
    //   interaction.reply({ content: 'Config command' });
    // })
    // Dev commands
    .with({ commandName: 'link' }, handleLinkCommand)
    .with({ commandName: 'send' }, handleSendCommand)
    .with({ commandName: 'stake' }, handleStakeCommand)
    .with({ commandName: 'unlink' }, handleUnlinkCommand)
    .with({ commandName: 'user-info' }, handleUserInfo)
    // Genesis commands
    .with({ commandName: 'snapshot' }, handleSnapshotCommand)
    .with({ commandName: 'push' }, handlePushCommand)
    // Default commands
    .with({ commandName: 'balance' }, handleBalanceCommand)
    .with({ commandName: 'ping' }, () =>
      interaction.reply({ content: `Pong!` })
    )
    .with({ commandName: 'version' }, () => {
      const v = environment.development ? `${appVersion}-dev` : appVersion;

      interaction.reply({ ephemeral: true, content: `v${v}` });
    })

    .exhaustive();
};
