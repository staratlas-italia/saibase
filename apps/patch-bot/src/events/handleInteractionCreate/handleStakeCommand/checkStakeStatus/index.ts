import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { mints } from '@saibase/constants';
import { sendEnlistTransaction } from '@saibase/star-atlas';
import { getSolBalanceByOwner, getTokensByOwner } from '@saibase/web3';
import { Keypair, PublicKey } from '@solana/web3.js';
import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import * as R from 'fp-ts/Record';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { WithId } from 'mongodb';
import { match } from 'ts-pattern';
import {
  connection,
  minStakeResourceBalance,
  minStakeSolBalance,
} from '../../../../constants';
import { AppState } from '../../../../state';
import { UserWallet } from '../../../../types';
import { decrypt } from '../../../../utils/crypto';
import { updateWalletStatus } from '../updateWalletStatus';

export const checkStakeStatus = async (
  state: AppState,
  userWallet: WithId<UserWallet>
) => {
  const owner = new PublicKey(userWallet.publicKey);

  const solBalance = await getSolBalanceByOwner({
    connection,
    owner,
  })();

  const hasEnoughSol = solBalance >= minStakeSolBalance;

  const amounts = await pipe(
    getTokensByOwner({
      connection,
      owner,
      filters: [mints.ammo, mints.food, mints.fuel, mints.toolkit],
    }),
    T.map(R.toEntries),
    T.map(A.map(([, { amount }]) => amount))
  )();

  const hasEnoughResources = amounts.every(
    (resourceAmount) => resourceAmount >= minStakeResourceBalance
  );

  return match(userWallet)
    .with({ status: 'SOL_AND_RESOURCES_NEEDED' }, async () => {
      if (hasEnoughSol && hasEnoughResources) {
        await updateWalletStatus(state, userWallet.publicKey, 'PLAYER_NEEDED');

        return true;
      }

      return false;
    })
    .with({ status: 'PLAYER_NEEDED' }, async () => {
      if (hasEnoughSol && hasEnoughResources) {
        const privateKey = decrypt({ text: userWallet.encryptedPrivateKey });
        const signer = Keypair.fromSecretKey(bs58.decode(privateKey));

        const result = await sendEnlistTransaction({
          connection,
          factionId: 0,
          player: owner,
          signers: [signer],
        })();

        if (E.isLeft(result)) {
          return false;
        }

        await updateWalletStatus(state, userWallet.publicKey, 'READY');

        return true;
      }
    })
    .with({ status: 'READY' }, () => Promise.resolve(true))
    .exhaustive();
};
