import {
  APIApplicationCommandOption,
  ApplicationCommandOptionType,
} from 'discord.js';

type Commands = {
  name: string;
  description: string;
  options?: APIApplicationCommandOption[];
}[];

export const availableCommands = [
  // {
  //   name: 'config' as const,
  //   description: 'Configure the bot',
  //   options: [
  //     {
  //       name: 'dev-role' as const,
  //       description: 'Se development role',
  //       type: ApplicationCommandOptionType.Subcommand,
  //       options: [
  //         {
  //           name: 'role',
  //           description: 'Role to set',
  //           type: ApplicationCommandOptionType.Role,
  //           required: true,
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    name: 'push' as const,
    description: 'Refill push notifications',
    options: [
      {
        name: 'status',
        description: 'on/off',
        type: ApplicationCommandOptionType.String,
        choices: [
          { name: 'on', value: 'on' },
          { name: 'off', value: 'off' },
        ],
        required: true,
      },
    ],
  },
  {
    name: 'user-info' as const,
    description: 'Retrieve user informations',
    options: [
      {
        name: 'user',
        description: 'Mention a user',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
    ],
  },
  {
    name: 'link' as const,
    description: 'Link a discord account with a public key',
    options: [
      {
        name: 'user',
        description: 'Mention a user',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: 'public-key',
        description: 'The user public key',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  {
    name: 'unlink' as const,
    description: 'Unlink a discord account from a public key',
    options: [
      {
        name: 'user',
        description: 'Mention a user',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
    ],
  },
  {
    name: 'send' as const,
    description: 'Send <amount> tokens to <mention>',
    options: [
      {
        name: 'user',
        description: 'Mention a user',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: 'amount',
        description: 'Amount to send',
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
    ],
  },
  {
    name: 'balance' as const,
    description: 'Get user tokesn balance',
    options: [
      {
        name: 'user',
        description: 'Mention a user',
        type: ApplicationCommandOptionType.User,
      },
    ],
  },
  {
    name: 'snapshot' as const,
    description: 'Get SAI fleet snapshot',
  },
  {
    name: 'guild-snapshot' as const,
    description: 'Get SAI fleet guild snapshot',
  },
  {
    name: 'stake' as const,
    description: 'Stake your SA ships with SAI',
  },
  {
    name: 'ping' as const,
    description: 'Ping the bot',
  },
  {
    name: 'version' as const,
    description: 'Get bot version',
  },
] satisfies Commands;

export type CommandName = (typeof availableCommands)[number]['name'];
