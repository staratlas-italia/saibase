import { createError } from '@saibase/errors';
import { Connection, ParsedAccountData, PublicKey } from '@solana/web3.js';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

type Param = {
  connection: Connection;
  mint: PublicKey;
};

export const getNftOwner = ({ connection, mint }: Param) =>
  pipe(
    TE.tryCatch(
      () => connection.getTokenLargestAccounts(mint),
      createError('GetTokenLargestAccountError')
    ),
    TE.chainW((largestAccountResponse) =>
      TE.tryCatch(
        () =>
          connection.getParsedAccountInfo(
            largestAccountResponse.value[0].address
          ),
        createError('GetParsedAccountInfoError')
      )
    ),
    TE.map((accountInfo) => {
      const owner = (accountInfo.value?.data as ParsedAccountData).parsed.info
        .owner as string | null;

      return owner ? new PublicKey(owner) : null;
    })
  );
