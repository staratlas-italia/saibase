import { AppState } from '../../../../state';
import { UserWalletStatus } from '../../../../types';

export const updateWalletStatus = async (
  state: AppState,
  publicKey: string,
  newStatus: UserWalletStatus
) => {
  await state.database.usersWallets().updateOne(
    { publicKey },
    {
      $set: {
        status: newStatus,
      },
    }
  );

  return state.database.usersWallets().findOne({ publicKey });
};
