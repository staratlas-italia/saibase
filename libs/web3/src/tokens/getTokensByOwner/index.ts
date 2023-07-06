import { createError } from '@saibase/errors';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, ParsedAccountData, PublicKey } from '@solana/web3.js';
import * as A from 'fp-ts/Array';
import * as R from 'fp-ts/Record';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';

type Param = {
  connection: Connection;
  owner: PublicKey;
  filters?: PublicKey[];
};

export const getTokensByOwner = ({
  connection,
  owner,
  filters,
}: Param): T.Task<
  Record<string, { amount: number; mint: PublicKey; account: PublicKey }>
> =>
  pipe(
    TE.tryCatch(
      () =>
        connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
          filters: [
            {
              dataSize: 165,
            },
            {
              memcmp: {
                offset: 32,
                bytes: owner.toString(),
              },
            },
          ],
        }),
      createError('GetParsedProgramAccountsError')
    ),
    TE.map((accounts) =>
      pipe(
        accounts,
        A.map((accountData) => {
          const mint = (accountData.account.data as ParsedAccountData)[
            'parsed'
          ]['info']['mint'] as string;

          return [
            mint,
            {
              account: accountData.pubkey,
              mint: new PublicKey(mint),
              amount: ((accountData.account.data as ParsedAccountData)[
                'parsed'
              ]['info']['tokenAmount']['uiAmount'] || 0) as number,
            },
          ] as [
            string,
            { account: PublicKey; mint: PublicKey; amount: number }
          ];
        }),
        R.fromEntries,
        R.filter(({ mint }) =>
          filters
            ? filters.map((f) => f.toString()).includes(mint.toString())
            : true
        )
      )
    ),
    TE.getOrElseW(() => T.of({}))
  );
