import { EmbedBuilder, EmbedField, Message, TextChannel } from 'discord.js';
import { chunksOf } from 'fp-ts/Array';
import { guildSnapshot } from '../../../commands/guildSnapshot';
import { AppState } from '../../../state';

export const createOnGuildSnapshot =
  (message: Message, state: AppState) => async () => {
    const data = await guildSnapshot(state);

    let totalUsd = 0;

    const fields: EmbedField[] = Object.values(data.ships).map((item) => {
      const totalPrice =
        (item.vwap || 1) * (item.stakedQuantity ?? 0) +
        (item.vwap || 1) * (item.inWalletQuantity ?? 0);
      totalUsd += totalPrice;

      return {
        inline: true,
        name: item.name,
        value: `n. ${
          item.stakedQuantity + item.inWalletQuantity
        } ~ ${new Intl.NumberFormat('it', {
          style: 'currency',
          currency: 'USD',
        }).format(totalPrice)}`,
      };
    });

    const chunkedFields = chunksOf(24)(fields);

    const embeds = chunkedFields.map((fields, index) => {
      const builder = new EmbedBuilder()
        .setTitle(
          `SAI Fleet guild-only Snapshot ${
            chunkedFields.length > 1 ? `- Page ${index + 1}` : ''
          }`
        )
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
