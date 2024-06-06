import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { mints, mintsDecimals } from '@saibase/constants';
import { matchMethodMiddleware } from '@saibase/middlewares';
import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';
import {
  Cluster,
  Connection,
  Keypair,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import { pipe } from 'fp-ts/function';
import { NextApiRequest, NextApiResponse } from 'next';
import { match } from 'ts-pattern';
import { encodeBase64 } from 'tweetnacl-util';
import {
  APP_BASE_URL,
  DEVNET_TOKEN_SWAP_STATE_ACCOUNTS,
  TOKEN_SWAP_STATE_ACCOUNTS,
} from '../../../common/constants';
import { getConnectionClusterUrl } from '../../../utils/connection';

const getSwapState = (cluster?: Cluster) =>
  cluster === 'devnet'
    ? DEVNET_TOKEN_SWAP_STATE_ACCOUNTS
    : TOKEN_SWAP_STATE_ACCOUNTS;

const keypair = Keypair.fromSecretKey(
  bs58.decode(process.env.PROCEEDS_PRIVATE_KEY!)
);

const getHandler = (req: NextApiRequest, res: NextApiResponse) => {
  const stateAccountField = req.query.stateAccount as string;
  const clusterField = req.query.cluster as Cluster | undefined;

  const state = getSwapState(clusterField)[stateAccountField];

  const path = state.image.square;

  res.status(200).json({
    label: state.name,
    icon: `${APP_BASE_URL}${path}`,
  });
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const publicKeyField = req.body?.account;
  const stateAccountField = req.query.stateAccount as string;
  const referenceField = req.query.reference as string;
  const clusterField = req.query.cluster as Cluster | undefined;
  const quantity = Number(req.query.quantity as string);

  if (!stateAccountField || !publicKeyField || !referenceField || !quantity) {
    throw new Error('Invalid params');
  }

  const publicKey = new PublicKey(publicKeyField);

  const reference = new PublicKey(referenceField);

  const connection = new Connection(getConnectionClusterUrl(clusterField));

  const buyerOutTokenAccount = getAssociatedTokenAddressSync(
    clusterField === 'devnet' ? mints.usdcDevnet : mints.usdc,
    publicKey
  );

  const states = getSwapState(clusterField);

  const state = states[stateAccountField];

  if (!state) {
    throw new Error('Invalid state account');
  }

  const amount = match(state.price)
    .with({ type: 'unit' }, ({ value }) => value * (quantity ?? 1))
    .with({ type: 'package' }, ({ value }) => value)
    .exhaustive();

  const buyerInTokenAccount = getAssociatedTokenAddressSync(
    state.mint,
    publicKey
  );

  const ownerOutTokenAccount = getAssociatedTokenAddressSync(
    state.mint,
    keypair.publicKey
  );

  const usdcMint = clusterField === 'devnet' ? mints.usdcDevnet : mints.usdc;
  const ownerInTokenAccount = getAssociatedTokenAddressSync(
    usdcMint,
    keypair.publicKey
  );

  const tokenIx = createTransferCheckedInstruction(
    ownerOutTokenAccount,
    state.mint,
    buyerInTokenAccount,
    keypair.publicKey,
    quantity,
    0
  );

  const usdcIx = createTransferCheckedInstruction(
    buyerOutTokenAccount,
    usdcMint,
    ownerInTokenAccount,
    publicKey,
    amount * Math.pow(10, mintsDecimals.usdc.toNumber()),
    mintsDecimals.usdc.toNumber()
  );

  tokenIx.keys.push({
    pubkey: reference,
    isWritable: false,
    isSigner: false,
  });

  const chainInfo = await connection.getLatestBlockhashAndContext();

  const messageV0 = new TransactionMessage({
    payerKey: publicKey,
    recentBlockhash: chainInfo.value.blockhash,
    instructions: [tokenIx, usdcIx],
  }).compileToV0Message();

  const transaction = new VersionedTransaction(messageV0);

  transaction.sign([keypair]);

  const serializedTransaction = encodeBase64(transaction.serialize());

  const message = `Thank you for your purchase of ${state.name}`;

  res.status(200).json({ transaction: serializedTransaction, message });
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  match(req.method as 'POST' | 'GET')
    .with('GET', () => getHandler(req, res))
    .with('POST', () => postHandler(req, res))
    .otherwise(() => null);
};

export default pipe(handler, matchMethodMiddleware(['GET', 'POST']));
