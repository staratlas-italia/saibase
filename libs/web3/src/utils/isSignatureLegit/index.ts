import * as ed from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha512';
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';

ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

type Param = {
  proof: string;
  message: string;
};

export const isSignatureLegit =
  ({ proof, message }: Param) =>
  (signer: PublicKey) =>
    pipe(
      O.tryCatch(() => bs58.decode(proof)),
      O.chain((decodedSignature) =>
        O.tryCatch(() =>
          ed.verify(
            decodedSignature,
            new TextEncoder().encode(message),
            signer.toBytes()
          )
        )
      ),
      O.getOrElse(() => false)
    );
