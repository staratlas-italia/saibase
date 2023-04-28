import { EmbedBuilder, EmbedField, Message, TextChannel } from 'discord.js';
import { snapshot } from '../../../commands/snapshot';
import { AppState } from '../../../state';

export const createOnSnapshot =
  (message: Message, state: AppState) => async () => {
    const data = await snapshot(state);

    let totalUsd = 0;

    const fields: EmbedField[] = Object.values(data.ships).map((item) => {
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

    const embed = new EmbedBuilder()
      .setTitle('SAI Fleet Snapshot')
      .setColor('#eef35f')
      .setDescription(
        `Total value: ${new Intl.NumberFormat('it', {
          style: 'currency',
          currency: 'USD',
        }).format(totalUsd)}`
      )
      .setFields(fields)
      .setFooter({
        text: `Note: the prices in this table are calculated using VWAP prices`,
      });

    (message.channel as TextChannel).send({
      content: `<@${message.author.id}> here the requested snapshot`,
      embeds: [embed],
    });
  };
