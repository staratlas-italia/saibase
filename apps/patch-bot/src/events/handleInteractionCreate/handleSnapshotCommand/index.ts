import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  EmbedField,
} from 'discord.js';
import { chunksOf } from 'fp-ts/Array';
import { snapshot } from '../../../commands/snapshot';
import { AppState } from '../../../state';
import { withPermissions } from '../../../utils/withPermissions';

const handleSnapshotCommandHandler = async ({
  state,
  interaction,
}: {
  state: AppState;
  interaction: ChatInputCommandInteraction;
}) => {
  await interaction.deferReply({ ephemeral: true });

  const data = await snapshot(state);

  let totalUsd = 0;

  const fields: EmbedField[] = Object.values(data.ships).map((item) => {
    const totalPrice = (item.vwap || 1) * (item.stakedQuantity ?? 0);
    totalUsd += totalPrice;

    return {
      inline: true,
      name: item.name,
      value: `n. ${item.stakedQuantity} ~ ${new Intl.NumberFormat('it', {
        style: 'currency',
        currency: 'USD',
      }).format(totalPrice)}`,
    };
  });

  const chunkedFields = chunksOf(24)(fields);

  const embeds = chunkedFields.map((fields, index) => {
    const builder = new EmbedBuilder()
      .setTitle(`SAI Fleet Snapshot - Page ${index + 1}`)
      .setColor('#eef35f')
      .setFields(fields);

    if (index === chunkedFields.length - 1) {
      builder.setFooter({
        text: `Note: the prices in this table are calculated using VWAP prices`,
      });
    }

    if (index === 0) {
      builder.setDescription(
        `Total value: ${new Intl.NumberFormat('it', {
          style: 'currency',
          currency: 'USD',
        }).format(totalUsd)}`
      );
    }

    return builder;
  });

  interaction.editReply({
    content: `<@${interaction.member?.user.id}> here the requested snapshot`,
    embeds,
  });
};

export const handleSnapshotCommand = withPermissions(
  handleSnapshotCommandHandler,
  'genesis'
);
