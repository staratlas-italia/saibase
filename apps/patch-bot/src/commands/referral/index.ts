import { TextChannel } from 'discord.js';
import { logger } from '../../logger';

type Param = {
  channel: TextChannel;
};

export const referral = async ({ channel }: Param) => {
  try {
    const invite = await channel.createInvite({
      unique: true,
      temporary: false,
    });

    return `Ecco il tuo referral link: https://discord.gg/${invite.code}`;
  } catch (e) {
    logger.log('Error', e);
    return 'Errore durante la creazione del referral link';
  }
};
