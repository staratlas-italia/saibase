import invariant from 'invariant';
import { discordBotToken } from '../../constants';

export const checkRequiredConstants = () => {
  invariant(discordBotToken, 'The discord token is not valid');

  return {
    discordBotToken,
  };
};
