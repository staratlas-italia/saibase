import { AppState } from '../../../../state';
import { createUserWallet } from '../../../../utils/createUserWallet';

type Param = {
  state: AppState;
  discordId: string;
};

export const getOrCreateUserWallet = async ({ state, discordId }: Param) => {
  const userWallet = await state.database.usersWallets().findOne({ discordId });

  if (!userWallet) {
    return createUserWallet({ state, discordId });
  }

  return userWallet;
};
