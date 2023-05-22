import { encodeURL } from '@solana/pay';
import { AttachmentBuilder, ChatInputCommandInteraction } from 'discord.js';
import qrcode from 'qrcode';
import {
  apiBaseUrl,
  minStakeResourceBalance,
  minStakeSolBalance,
} from '../../../constants';
import { AppState } from '../../../state';
import { withPermissions } from '../../../utils/withPermissions';
import { checkStakeStatus } from './checkStakeStatus';
import { getOrCreateUserWallet } from './getOrCreateUserWallet';

const handleStakeCommandHandler = async ({
  state,
  interaction,
}: {
  state: AppState;
  interaction: ChatInputCommandInteraction;
}) => {
  await interaction.deferReply({ ephemeral: true });

  const user = await state.database
    .users()
    .findOne({ discordId: interaction.member?.user.id });

  if (!user || !user.discordId) {
    interaction.editReply({
      content: `We cannot find your user informations. Please, retry later`,
    });
    return;
  }

  const userWallet = await getOrCreateUserWallet({
    state,
    discordId: user.discordId,
  });

  if (!userWallet) {
    interaction.editReply({
      content: `An error occured creating a wallet for you. Please, retry later`,
    });
    return;
  }

  await checkStakeStatus(state, userWallet);

  const currentUrl = new URL(`${apiBaseUrl}/api/stake`);

  currentUrl.searchParams.append('cluster', 'mainnet-beta');

  currentUrl.searchParams.append('recipient', userWallet.publicKey.toString());

  const url = encodeURL({
    link: currentUrl,
  });

  const qrcodeUrl = await qrcode.toDataURL(url.toString(), {
    type: 'image/jpeg',
  });

  const imageStream = Buffer.from(qrcodeUrl.split(',')[1], 'base64');
  const messageAttachment = new AttachmentBuilder(imageStream);

  const messages = [
    `**Min. SOL richiesti**: ${minStakeSolBalance} SOL`,
    `**Min. risorse richieste**: ${minStakeResourceBalance}`,
    `**Invia tutto a questo wallet**: \`${userWallet.publicKey.toString()}\n`,
    'Oppure, inquadra il QRCode qui sotto e usa  Solana Pay per trasferire tutto più velocemente',
  ];

  interaction.editReply({
    content: messages.join('\n'),
    files: [messageAttachment],
  });
};

export const handleStakeCommand = withPermissions(
  handleStakeCommandHandler,
  'dev'
);
