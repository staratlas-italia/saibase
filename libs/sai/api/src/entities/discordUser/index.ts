import * as t from 'io-ts';

export const discordUserCodec = t.type({
  id: t.string,
  username: t.string,
});

export type DiscordUser = t.TypeOf<typeof discordUserCodec>;