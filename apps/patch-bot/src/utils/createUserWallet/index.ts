import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { Keypair } from '@solana/web3.js';
import { AppState } from '../../state';
import { encrypt } from '../crypto';

type Param = {
  state: AppState;
  discordId: string;
};
export const createUserWallet = async ({ state, discordId }: Param) => {
  const keypair = Keypair.generate();

  const encryptedPrivateKey = encrypt({
    text: bs58.encode(keypair.secretKey),
  });

  const insertResult = await state.database.usersWallets().insertOne({
    discordId,
    publicKey: keypair.publicKey.toString(),
    encryptedPrivateKey: encryptedPrivateKey,
    status: 'SOL_AND_RESOURCES_NEEDED',
  });

  const insertedUserWallet = await state.database
    .usersWallets()
    .findOne({ _id: insertResult.insertedId });

  return insertedUserWallet;
};
