import * as E from 'fp-ts/Either';
import { flow } from 'fp-ts/function';
import { parsePublicKey } from '../parsePublicKey';

export const isPublicKey = flow(parsePublicKey, E.isRight);
