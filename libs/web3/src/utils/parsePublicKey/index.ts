import { createError } from '@saibase/errors';
import { PublicKey } from '@solana/web3.js';
import * as E from 'fp-ts/Either';

export const parsePublicKey = (pk: string) =>
  E.tryCatch(() => new PublicKey(pk), createError('PublicKeyParseError'));
