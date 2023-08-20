import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { mints } from '@saibase/constants';
import { createError } from '@saibase/errors';
import {
  StarAtlasNft,
  fetchNftsByCategory,
  getInitialDepositInstruction,
} from '@saibase/star-atlas';
import {
  createVersionedTransaction,
  getLatestBlockhash,
  getSolBalanceByOwner,
  getTokensByOwner,
  parsePublicKey,
} from '@saibase/web3';
import { captureException } from '@sentry/node';
import { getAssociatedTokenAddressSync } from '@solana/spl-token-latest';
import { Keypair, PublicKey } from '@solana/web3.js';
import * as R from 'fp-ts/Record';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { connection } from '../../constants';
import { AppState } from '../../state';
import { decrypt } from '../../utils/crypto';

const getTokensByOwnerWithAmountGreaterThanZero = (owner: PublicKey) =>
  pipe(
    getTokensByOwner({
      connection,
      owner,
    }),
    T.map(R.filter(({ amount }) => amount > 0))
  );

const getStarAtlasTokensAmounts = (owner: PublicKey) =>
  pipe(
    TE.Do,
    TE.bind('owner', () => TE.of(owner)),
    TE.bind('ships', () => fetchNftsByCategory({ category: 'ship' })),
    TE.bindW('solAmount', () =>
      TE.fromTask(getSolBalanceByOwner({ connection, owner }))
    ),
    TE.bindW('tokensWithAmoutGreaterThanZero', () =>
      TE.fromTask(getTokensByOwnerWithAmountGreaterThanZero(owner))
    ),
    TE.bindW('starAtlasTokens', ({ tokensWithAmoutGreaterThanZero, ships }) =>
      pipe(
        tokensWithAmoutGreaterThanZero,
        R.filter(({ mint }) => {
          const shipsMints = ships.map((ship) => ship.mint);
          const resourcesMints = [
            mints.atlas,
            mints.usdc,
            mints.polis,
            mints.ammo,
            mints.fuel,
            mints.food,
            mints.toolkit,
            ...shipsMints,
          ].map((mint) => mint.toString());

          return resourcesMints.includes(mint.toString());
        }),
        TE.of
      )
    ),
    TE.mapLeft((error) => createError(error.type)(error.error))
  );

const getInitialDepositTx = ({
  amount,
  owner,
  shipMint,
}: {
  amount: number;
  owner: PublicKey;
  shipMint: PublicKey;
}) =>
  pipe(
    TE.Do,
    TE.bind('ix', () =>
      getInitialDepositInstruction({
        connection,
        player: owner,
        shipMint,
        shipTokenAccount: getAssociatedTokenAddressSync(shipMint, owner),
        shipQuantity: amount,
      })
    ),
    TE.bindW('recentBlockhash', () => getLatestBlockhash(connection)),
    TE.map(({ ix, recentBlockhash }) =>
      createVersionedTransaction({
        feePayer: owner,
        instructions: [ix],
        recentBlockhash: recentBlockhash.blockhash,
      })
    )
  );

const getStakeDepositTx = ({
  owner,
  starAtlasTokens,
  ship,
}: {
  owner: PublicKey;
  starAtlasTokens: Awaited<
    ReturnType<ReturnType<typeof getTokensByOwnerWithAmountGreaterThanZero>>
  >;
  ship: StarAtlasNft;
}) =>
  pipe(
    starAtlasTokens,
    R.lookup(ship.mint.toString()),
    TE.fromOption(() =>
      createError('ShipNotFound')(
        `Do not have ship with mint ${ship.mint.toString()}`
      )
    ),
    TE.chainW((shipToken) =>
      getInitialDepositTx({
        owner,
        amount: shipToken.amount,
        shipMint: shipToken.mint,
      })
    )
  );

export const createStakeShipIfNeededHandler = (state: AppState) => async () => {
  const wallets = await state.database.usersWallets().find().toArray();

  pipe(
    wallets,
    TE.traverseArray((wallet) =>
      pipe(
        parsePublicKey(wallet.publicKey),
        TE.fromEither,
        TE.chainW(getStarAtlasTokensAmounts),
        TE.chainFirstIOK(
          ({ owner, solAmount, ships, starAtlasTokens }) =>
            () => {
              console.log({ solAmount });

              const keypair = Keypair.fromSecretKey(
                bs58.decode(decrypt({ text: wallet.encryptedPrivateKey }))
              );

              pipe(
                ships,
                TE.traverseArray((ship) =>
                  pipe(
                    getStakeDepositTx({ ship, owner, starAtlasTokens }),
                    TE.chainIOK((tx) => () => {
                      tx.sign([keypair]);

                      // connection.simulateTransaction(tx).then((result) => {
                      //   state.logger.log(JSON.stringify(result, null, 2));
                      // });

                      connection
                        .sendTransaction(tx)
                        .then((txid) => {
                          state.logger.log('SHIP TX', txid);
                        })
                        .catch((e) => {
                          state.logger.error('SHIP Err', e);
                        });
                    })
                  )
                )
              )();

              // for (const ship of ships) {
              //   pipe(
              //     starAtlasTokens,
              //     R.lookup(ship.mint.toString()),
              //     TE.fromOption(() =>
              //       createError('ShipNotFound')(
              //         `Do not have ship with mint ${ship.mint.toString()}`
              //       )
              //     ),
              //     TE.chainW((shipToken) =>
              //       getInitialDepositTx({
              //         owner,
              //         amount: shipToken.amount,
              //         shipMint: shipToken.mint,
              //       })
              //     ),
              //     TE.chainFirstIOK((tx) => () => {
              //       tx.sign([keypair]);

              //       connection.simulateTransaction(tx).then((result) => {
              //         state.logger.log(JSON.stringify(result, null, 2));
              //       });

              //       // connection
              //       //   .sendTransaction(tx)
              //       //   .then((txid) => {
              //       //     state.logger.log(txid);
              //       //   })
              //       //   .catch((e) => {
              //       //     state.logger.error(e);
              //       //   });
              //     })
              //   )();
              // }

              // state.logger.log('Staking ship', mint);
              // const result = await getInitialDepositInstruction({
              //   connection,
              //   player: owner,
              //   shipMint: mint,
              //   shipTokenAccount: getAssociatedTokenAddressSync(mint, owner),
              //   shipQuantity: amount,
              // })();
              // if (E.isLeft(result)) {
              //   state.logger.error(result.left);
              //   continue;
              // }
              // const { blockhash } = await connection.getLatestBlockhash();
              // const messageV0 = new TransactionMessage({
              //   payerKey: owner,
              //   recentBlockhash: blockhash,
              //   instructions: [result.right],
              // }).compileToV0Message();
              // const transaction = new VersionedTransaction(messageV0);
              // transaction.sign([keypair]);
              // const txid = await connection.sendTransaction(transaction);
              // state.logger.log(
              //   `https://explorer.solana.com/tx/${txid}?cluster=devnet`
              // );
            }
        ),
        TE.orElseFirstIOK((error) => () => {
          state.logger.error(error);

          if (error.type === 'PublicKeyParseError') {
            return;
          }

          captureException({
            error,
          });
        })
      )
    )
  )();
};
