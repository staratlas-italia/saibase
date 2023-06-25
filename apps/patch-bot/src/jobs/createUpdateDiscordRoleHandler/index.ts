import { getAllTokenHolders } from '@saibase/web3';
import { captureException } from '@sentry/node';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { BADGES_MINT_ROLES, connection } from '../../constants';
import { roleIds } from '../../constants/roles';
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

    const guild =
      state.discord.guilds.cache.get(botGuild.serverId) ||
      (await state.discord.guilds.fetch(botGuild.serverId));

    if (!guild) {
      return;
    }

    try {
      for (const [mint, roleId] of BADGES_MINT_ROLES) {
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
          ' holders with at least one token in their wallet'
        );

        const membersWithBadge = guild.roles.cache.get(roleId)?.members;

        const membersWithBadgeIds = membersWithBadge?.map((m) => m.id) || [];

        const usersCollection = state.database.users();

        // Removing roles to everyone with no badge
        const usersWithBadge = await usersCollection
          .find({
            discordId: { $in: membersWithBadgeIds },
            serverId: botGuild.serverId,
          })
          .toArray();

        state.logger.log(
          `Found ${usersWithBadge.length} users with SAI badges`
        );

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

          if (member?.roles.cache.has(roleId)) {
            state.logger.info(
              `Removing role ${roleId} to user`,
              member?.user.username,
              member?.id
            );

            member.roles.remove(roleId);
          }
        }

        const holdersPublicKeys = holdersWithAtLeastOneToken.map(
          (h) => h.owner
        );

        const probablyBadgeHolderUsers = await usersCollection
          .find({
            wallets: { $in: holdersPublicKeys },
            discordId: { $ne: null },
            serverId: botGuild.serverId,
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

          state.logger.info('Getting memeber: ', probablyBadgeHolder.discordId);

          try {
            const member =
              guild.members.cache.get(probablyBadgeHolder.discordId) ||
              (await guild.members.fetch(probablyBadgeHolder.discordId));

            if (!member) {
              continue;
            }

            const hasRole = member.roles.cache.has(roleId);

            if (!hasRole) {
              state.logger.info(
                `Adding role ${roleId} to user`,
                member.user.username,
                member.id
              );

              member.roles.add(roleId);
            }
          } catch (err) {
            captureException(err, {
              level: 'error',
            });
          }
        }
      }
    } catch (err) {
      captureException(err, {
        level: 'error',
      });
    }
  }
};
