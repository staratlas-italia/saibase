import { get, withAuthorization, withDecoder } from '@saibase/fetch';
import { pipe } from 'fp-ts/lib/function';
import { discordUserCodec } from '../entities/discordUser';

export const DISCORD_API_URL = 'https://discord.com/api';

export const getDiscordSelf = async (token: string) => {
  return pipe(
    get,
    withDecoder(discordUserCodec),
    withAuthorization(`Bearer ${token}`)
  )(`${DISCORD_API_URL}/users/@me`);
};
