import * as Sentry from '@sentry/node';
import axios, { AxiosResponse } from 'axios';
import { TextChannel } from 'discord.js';
import { logger } from '../../logger';
import { getMembersWhoAllowedNotifications } from '../../queries/getMembersWhoAllowedNotifications';
import { AppState } from '../../state';
import { ScoreFleetResponse } from '../../types/api';

import { getShipLevel } from '../../utils/getShipLevel';

export const createRefillCheckJobHandler =
  (state: AppState) => async (_: string) => {
    const guilds = await state.database
      .guilds()
      .find({
        'options.announcementsChannelId': { $exists: true },
      })
      .toArray();

    for (const guild of guilds) {
      state.logger.info(`Starting refill check for guild ${guild.serverName}`);

      // current datetime - 5:50 hours
      const checkDate = new Date(Date.now() - 21_000_000);

      const currentTime = new Date();

      const hour = currentTime.getUTCHours();

      logger.info('Fleets check is starting at', hour);

      if (hour <= 5 || hour >= 22) {
        logger.info('skipping check between 22pm and 5am');

        return;
      }

      const announcementsChannelId =
        guild.options?.announcementsChannelId ?? '';

      const channel =
        (await state.discord.channels.cache.get(announcementsChannelId)) ||
        (await state.discord.channels.fetch(announcementsChannelId));

      const users = await getMembersWhoAllowedNotifications(checkDate, state);

      const usersNeedToRefill = new Set<string>();

      let fleet: AxiosResponse<ScoreFleetResponse>;

      await Promise.all(
        users.map(async (user) => {
          const id = user.discordId;

          if (!id) {
            return;
          }

          for (const wallet of user.wallets) {
            logger.info(`Checking ${wallet} fleet of user ${user.discordId}`);

            try {
              fleet = await axios.get(
                `https://app.staratlasitalia.com/api/score/${wallet}`
              );
            } catch (e) {
              Sentry.captureException(e, {
                level: 'error',
                tags: { cause: 'score_api', user: wallet },
              });
              continue;
            }

            if (fleet.data.success) {
              for (const ship of fleet.data.data) {
                if (usersNeedToRefill.has(id)) {
                  break;
                }

                if (getShipLevel(ship, 'food') < 10) {
                  logger.info(
                    'ADDED x FOOD ' + getShipLevel(ship, 'food') + '%: ' + id
                  );
                  usersNeedToRefill.add(id);
                  continue;
                }

                if (getShipLevel(ship, 'ammo') < 10) {
                  logger.info(
                    'ADDED x AMMO ' + getShipLevel(ship, 'ammo') + '%: ' + id
                  );
                  usersNeedToRefill.add(id);
                  continue;
                }

                if (getShipLevel(ship, 'fuel') < 10) {
                  logger.info(
                    'ADDED x FUEL ' + getShipLevel(ship, 'fuel') + '%: ' + id
                  );
                  usersNeedToRefill.add(id);
                  continue;
                }

                if (getShipLevel(ship, 'tools') < 10) {
                  logger.info(
                    'ADDED x TOOLS ' + getShipLevel(ship, 'tools') + '%: ' + id
                  );
                  usersNeedToRefill.add(id);
                }
              }
            }
          }
        })
      );

      const usersCollection = state.database.users();

      const result = await usersCollection.updateMany(
        {
          discordId: { $in: [...usersNeedToRefill] },
        },
        { $set: { lastRefillAt: currentTime } }
      );

      logger.info(
        'Update lastRefillAt success =',
        result.modifiedCount === usersNeedToRefill.size
      );

      logger.info(`NEED REFILL LENGTH: ${usersNeedToRefill.size}`);

      let message: string;

      if (usersNeedToRefill.size > 0) {
        const lastMessages = await (channel as TextChannel).messages.fetch({
          limit: 20,
        });

        lastMessages.forEach((msg) => {
          if (msg.author.id === state.discord.user?.id) {
            msg.delete();
          }
        });

        message = [...usersNeedToRefill]
          .map(
            (id, index) =>
              `<@${id}>${index < usersNeedToRefill.size - 1 ? ', ' : ''}`
          )
          .join('');

        message = `${message} una o più navi della vostra flotta stanno per esaurire le risorse! È il momento di rifornire l'equipaggio!`;

        (channel as TextChannel).send(message);
      }
    }

    logger.info('DONE');
  };
