import { appVersion, environment } from '@saibase/configuration';
import { createCommand } from 'commander';
import { Message } from 'discord.js';
import { constVoid } from 'fp-ts/function';
import { AppState } from '../../state';
import { checkRoles } from '../../utils/checkPermission';
import { createLinkDiscordCommandHandler } from './createLinkDiscordCommandHandler';
import { createSendTokensHandler } from './createOnSendTokens';
import { createOnSnapshot } from './createOnSnapshot';
import { createOnTokensBalance } from './createOnTokensBalance';
import { createUserInfoHandler } from './createOnUserInfo';
import { createUnlinkDiscordCommandHandler } from './createUnlinkDiscordCommand';

const programName = '$patch';

const createProgram = (message: Message, state: AppState) => {
  const program = createCommand(programName).exitOverride();

  if (!message.member) {
    message.reply({ content: 'Cannot verify your permissions' });

    return program;
  }

  const { isAdmin, isCitizen, isDev, isGenesisHolder, isTutor } = checkRoles({
    author: message.member,
  });

  if (isAdmin) {
    program
      .command('send <mention> <amount>')
      .description('Send <amount> tokens to <mention>')
      .action(createSendTokensHandler(message, state));

    program
      .command('user-info <mention>')
      .description('Get <mention> user info')
      .action(createUserInfoHandler(message, state));

    program
      .command('link <mention> <publicKey>')
      .description('Link user <mention> to <publicKey>')
      .action(createLinkDiscordCommandHandler(message, state));

    program
      .command('unlink <mention>')
      .description('Unlink user <mention>')
      .action(createUnlinkDiscordCommandHandler(message, state));
  }

  if (isDev || isGenesisHolder || isCitizen || isTutor) {
    program
      .command('snapshot')
      .description('Retrieve guild fleet stats')
      .action(createOnSnapshot(message, state));
  }

  program
    .command('balance [mention]')
    .description('Get your balance or user [mention] balance')
    .action(createOnTokensBalance(message, state));

  program.command('ping').action(() => {
    message.reply({ content: `pong` });
  });

  program.command('version').action(() => {
    const v = environment.development ? `${appVersion}-dev` : appVersion;

    message.reply({ content: `v${v}` });
  });

  program.configureOutput({
    writeOut: (content) => message.reply({ content }),
    writeErr: constVoid,
  });

  return program;
};

export const handleMessageCreate = async (
  message: Message<boolean>,
  state: AppState
) => {
  if (!message.content.startsWith(programName) || message.author.bot) {
    return;
  }

  state.logger.log('NEW COMMAND', message.content);

  const program = createProgram(message, state);

  try {
    program.parseAsync(message.content.trim().split(/ +/).slice(1), {
      from: 'user',
    });
  } catch (e) {
    message.reply({ content: program.helpInformation() });
  }
};
