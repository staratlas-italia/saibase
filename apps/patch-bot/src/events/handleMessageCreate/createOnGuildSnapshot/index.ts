import { EmbedBuilder, EmbedField, Message, TextChannel } from 'discord.js';
import { chunksOf } from 'fp-ts/lib/Array';
import { snapshot } from '../../../commands/snapshot';
import { AppState } from '../../../state';

export const createOnGuildSnapshot =
  (message: Message, state: AppState) => async () => {
    const data = await snapshot(state);

    let totalUsd = 0;

    const fields: EmbedField[] = Object.values(data.ships)
      .filter((item) => !!item.belongsToGuild)
      .map((item) => {
        const totalPrice = (item.vwap || 1) * item.stakedQuantity;
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

    (message.channel as TextChannel).send({
      content: `<@${message.author.id}> here the requested guild snapshot`,
      embeds,
    });
  };
