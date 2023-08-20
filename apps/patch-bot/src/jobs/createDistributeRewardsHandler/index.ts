import { MerkleDistributorSDK, utils } from '@saberhq/merkle-distributor';
import {
  SignerWallet,
  SingleConnectionBroadcaster,
  SolanaProvider,
} from '@saberhq/solana-contrib';
import { mints } from '@saibase/constants';
import { getAccountInfo, getTokenBalanceByMint } from '@saibase/web3';
import { captureException } from '@sentry/node';
import { u64 } from '@solana/spl-token';
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token-latest';
import { PublicKey } from '@solana/web3.js';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { botKeypair, connection } from '../../constants';
import { roleIds } from '../../constants/roles';
import { AppState } from '../../state';

export const createTransferAtlasInstructions = (
  destPublicKey: PublicKey,
  amount: number
) =>
  pipe(
    T.Do,
    T.bind('source', () =>
      T.of(getAssociatedTokenAddressSync(mints.atlas, botKeypair.publicKey))
    ),
    T.bind('destination', () =>
      T.of(getAssociatedTokenAddressSync(mints.atlas, destPublicKey))
    ),
    T.bind('destinationExists', ({ destination }) => {
      return pipe(
        getAccountInfo({
          connection,
          account: destination,
        }),
        TE.fold(
          () => T.of(false),
          (account) => T.of(Boolean(account))
        )
      );
    }),
    T.map(({ destination, destinationExists, source }) => {
      const ixs = [];

      if (!destinationExists) {
        ixs.push(
          createAssociatedTokenAccountInstruction(
            botKeypair.publicKey,
            destination,
            destPublicKey,
            mints.atlas
          )
        );
      }

      ixs.push(
        createTransferInstruction(
          source,
          destination,
          botKeypair.publicKey,
          amount * 10 ** 8
        )
      );

      return ixs;
    })
  );

export const createDistributeRewardsHandler = (state: AppState) => async () => {
  const guilds = await state.database.guilds().find().toArray();

  for (const botGuild of guilds) {
    const guild =
      state.discord.guilds.cache.get(botGuild.serverId) ||
      (await state.discord.guilds.fetch(botGuild.serverId));

    if (!guild) {
      return;
    }

    state.logger.info(`Starting Distribute rewards for ${guild.name}`);

    try {
      const tutorMembers = guild.roles.cache.get(roleIds.tutor)?.members;
      const genesisMembers = guild.roles.cache.get(roleIds.genesis)?.members;

      const tutorMembersIds = tutorMembers?.map((m) => m.id) || [];
      const genesisMembersIds = genesisMembers?.map((m) => m.id) || [];

      const memberIds = new Set([...tutorMembersIds, ...genesisMembersIds]);

      const users = await state.database
        .users()
        .find({
          $and: [
            { discordId: { $in: [...memberIds] } },
            { wallets: { $exists: true, $not: { $size: 0 } } },
          ],
        })
        .toArray();

      const bankAtlas = await getTokenBalanceByMint(
        connection,
        botKeypair.publicKey,
        mints.atlas
      )();

      // const daoAtlas = Math.floor(bankAtlas * 0.2);
      const rewardsAtlas = Math.floor(bankAtlas * 0.8);

      if (users.length > 0) {
        const atlasPerMember = Math.floor(rewardsAtlas / users.length);

        const provider = new SolanaProvider(
          connection,
          new SingleConnectionBroadcaster(connection),
          new SignerWallet(botKeypair)
        );

        const sdk = MerkleDistributorSDK.load({ provider });

        const { claims, merkleRoot, tokenTotal } = utils.parseBalanceMap(
          users.map((user) => ({
            address: user.wallets[0],
            earnings: (atlasPerMember * 10 ** 8).toString(),
          }))
        );

        const { tx, distributor } = await sdk.createDistributor({
          root: merkleRoot,
          maxTotalClaim: new u64(tokenTotal),
          maxNumNodes: new u64(Object.keys(claims).length),
          tokenMint: mints.atlas,
        });

        // const d = await sdk.loadDistributor(distributor);
        await sdk.loadDistributor(distributor);

        await tx.simulateTable();

        const pendingTx = await tx.send();

        const a = await pendingTx.wait();

        a.printLogs();

        // console.log('users', users.length);
        // console.log('Atlas', atlasPerMember);

        // const { blockhash } = await connection.getLatestBlockhash();

        // pipe(
        //   users,
        //   A.chunksOf(15),
        //   A.map((userChunk) =>
        //     pipe(
        //       userChunk,
        //       TE.traverseArray((user) =>
        //         pipe(
        //           parsePublicKey(user.wallets[0] || ''),
        //           TE.fromEither,
        //           TE.chain((publicKey) =>
        //             TE.fromTask(
        //               createTransferAtlasInstructions(
        //                 new PublicKey(publicKey),
        //                 atlasPerMember
        //               )
        //             )
        //           )
        //         )
        //       ),
        //       TE.map((ixs) => ixs.flat())
        //     )
        //   ),
        //   TE.sequenceArray,
        //   TE.chainW(
        //     TE.traverseArray((instructions) =>
        //       TE.of(
        //         createVersionedTransaction({
        //           feePayer: botKeypair.publicKey,
        //           instructions,
        //           recentBlockhash: blockhash,
        //         })
        //       )
        //     )
        //   ),
        //   TE.chainW(
        //     TE.traverseArray((tx) => {
        //       tx.sign([botKeypair]);

        //       return TE.tryCatch(
        //         () => connection.simulateTransaction(tx),
        //         createError('SimulateTransactionError')
        //       );
        //     })
        //   ),
        //   TE.map((txs) => txs.flat()),
        //   TE.chainFirstIOK((txs) => () => {
        //     for (const tx of txs) {
        //       console.log(tx);
        //     }
        //   })
        // )();
      }
    } catch (err) {
      state.logger.error(err);

      captureException(err, {
        level: 'error',
      });
    }
  }
};
