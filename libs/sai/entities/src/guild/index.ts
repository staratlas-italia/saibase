import { nullable, optional } from '@saibase/io-ts';
import * as t from 'io-ts';

export const guildCodec = t.type({
  serverId: t.string,
  serverName: t.string,
  ownerId: nullable(t.string),
  options: optional(
    t.type({
      rolesJobDisabled: optional(t.boolean),
      announcementsChannelId: optional(t.string),
    })
  ),
});

export type Guild = t.TypeOf<typeof guildCodec>;
