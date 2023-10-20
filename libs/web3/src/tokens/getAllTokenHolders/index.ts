import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, ParsedAccountData, PublicKey } from '@solana/web3.js';
import * as A from 'fp-ts/Array';
import * as TE from 'fp-ts/TaskEither';
import { constVoid, pipe } from 'fp-ts/function';

type Param = { connection: Connection; mint: PublicKey };

export type TokenInfo = {
  isNative: false;
  mint: string;
  owner: string;
  tokenAmount: { decimals: number; uiAmount: number };
};

export const getAllTokenHolders = ({ connection, mint }: Param) =>
  pipe(
    TE.tryCatch(
      () =>
        connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
          filters: [
            { dataSize: 165 },
            {
              memcmp: {
                offset: 0,
                bytes: mint.toString(),
              },
            },
          ],
        }),
      constVoid
    ),
    TE.map(
      A.map(
        (token) =>
          (token.account.data as ParsedAccountData).parsed.info as TokenInfo
      )
    )
  );
