import { getAllTokenHolders } from '@saibase/web3';
import { captureException } from '@sentry/node';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { BADGES_MINT_ROLES, connection } from '../../constants';
import { roleIds } from '../../constants/roles';
import { logger } from '../../logger';
import { AppState } from '../../state';

export const createUpdateDiscordRoleHandler = (state: AppState) => async () => {
  const guilds = await state.database
    .guilds()
    .find({
      $or: [
        { 'options.rolesJobDisabled': { $exists: false } },
        { 'options.rolesJobDisabled': false },
      ],
    })
    .toArray();

  for (const botGuild of guilds) {
    state.logger.log('Updating roles for', botGuild.serverName);

    // RUN ONLY FOR SAI, SKIP other guilds
    if (botGuild.serverId !== '917086339365744640') {
      continue;
    }

    const guild =
      state.discord.guilds.cache.get(botGuild.serverId) ||
      (await state.discord.guilds.fetch(botGuild.serverId));

    if (!guild) {
      return;
    }

    try {
      for (const [mint, roleId] of BADGES_MINT_ROLES) {
        // const holdersWithAtLeastOneToken = await pipe(
        //   fetchAllTokenHolders({ mint, apiToken: solscanApiToken }),
        //   TE.map(flow(RA.filter((h) => h.amount > 0))),
        //   TE.fold(
        //     () => T.fromIO(() => [] as Holder[]),
        //     (holdersWithAtLeastOneToken) =>
        //       T.fromIO(() => holdersWithAtLeastOneToken)
        //   )
        // )();

        const holdersWithAtLeastOneToken = await pipe(
          getAllTokenHolders({ connection, mint }),
          TE.map(flow(RA.filter((h) => h.tokenAmount.uiAmount > 0))),
          TE.fold(
            () => T.fromIO(() => []),
            (holdersWithAtLeastOneToken) =>
              T.fromIO(() => holdersWithAtLeastOneToken)
          )
        )();

        state.logger.log(
          'Found ',
          holdersWithAtLeastOneToken.length,
          ' holders with at least one token'
        );

        const membersWithBadge = guild.roles.cache.get(roleId)?.members;

        const membersWithBadgeIds = membersWithBadge?.map((m) => m.id) || [];

        const usersCollection = state.database.users();

        // Removing roles to everyone with no badge
        const usersWithBadge = await usersCollection
          .find({
            discordId: { $in: membersWithBadgeIds },
          })
          .toArray();

        for (const userWithBadge of usersWithBadge) {
          if (
            holdersWithAtLeastOneToken.some((holder) =>
              userWithBadge.wallets.includes(holder.owner)
            )
          ) {
            continue;
          }

          // Found a wallet not having the badge
          const member = membersWithBadge?.get(userWithBadge.discordId!);

          if (member?.roles.cache.has(roleIds.ledger)) {
            // Do not remove the role to who has legflag role,
            // due to a ledger bug
            continue;
          }

          // removing role

          if (member?.roles.cache.has(roleId)) {
            logger.info(
              `Removing role ${roleId} to user`,
              member?.user.username,
              member?.id
            );

            //member.roles.remove(roleId);
          }
        }

        const holdersPublicKeys = holdersWithAtLeastOneToken.map(
          (h) => h.owner
        );

        const probablyBadgeHolderUsers = await usersCollection
          .find({
            wallets: { $in: holdersPublicKeys },
            discordId: { $ne: null },
          })
          .toArray();

        // Adding role
        for (const probablyBadgeHolder of probablyBadgeHolderUsers) {
          if (
            !probablyBadgeHolder.discordId ||
            !Number(probablyBadgeHolder.discordId)
          ) {
            continue;
          }

          logger.info('Getting', probablyBadgeHolder.discordId);
          logger.info('Getting', probablyBadgeHolder.discordId);

          try {
            const member =
              guild.members.cache.get(probablyBadgeHolder.discordId) ||
              (await guild.members.fetch(probablyBadgeHolder.discordId));

            if (!member) {
              continue;
            }

            const hasRole = member.roles.cache.has(roleId);

            if (!hasRole) {
              logger.info(
                `Adding role ${roleId} to user`,
                member.user.username,
                member.id
              );

              member.roles.add(roleId);
            }
          } catch (err) {
            console.log('2', err);
            captureException(err, {
              level: 'error',
            });
          }
        }
      }
    } catch (err) {
      console.log('1', err);
      captureException(err, {
        level: 'error',
      });
    }
  }
};
