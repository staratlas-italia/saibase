import * as ed from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha512';
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

type Param = {
  proof: string;
  message: string;
  signer: PublicKey;
};

export const isSignatureValid = ({ proof, message, signer }: Param) => {
  try {
    const signatureProof = bs58.decode(proof);

    return ed.verify(
      signatureProof,
      new TextEncoder().encode(message),
      signer.toBytes()
    );
  } catch (e) {
    return false;
  }
};
