import { get, withDecoder, withHeaders } from '@saibase/fetch';
import { PublicKey } from '@solana/web3.js';
import { pipe } from 'fp-ts/function';
import { apiBaseUrl } from '../constants';
import { accountCodec } from './decoder';

type Param = {
  account: PublicKey;
  apiToken: string;
};

export const fetchAccountInfo = ({ account, apiToken }: Param) =>
  pipe(
    get,
    withDecoder(accountCodec),
    withHeaders({
      'Content-Type': 'application/json',
      token: apiToken,
    })
  )(`${apiBaseUrl}/account/${account.toString()}`);
