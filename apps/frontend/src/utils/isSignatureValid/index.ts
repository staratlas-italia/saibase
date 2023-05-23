import * as ed from '@noble/ed25519';
import { PublicKey, Transaction } from '@solana/web3.js';
import bs58 from 'bs58';

const MEMO_PROGRAM_ID = new PublicKey(
  'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'
);

export const validateLedgerAuthTx = (
  tx: Transaction,
  nonce: string,
  publicKey: PublicKey
): boolean => {
  try {
    if (!tx.signatures[0].publicKey.equals(publicKey)) {
      return false;
    }

    const inx = tx.instructions[0];

    if (!inx.programId.equals(MEMO_PROGRAM_ID)) {
      return false;
    }

    if (inx.data.toString() != nonce) {
      return false;
    }

    if (!tx.verifySignatures()) {
      return false;
    }
  } catch (e) {
    return false;
  }

  return true;
};

type Param = {
  proof: string;
  message: string;
  signer: PublicKey;
};

export const isSignatureValid = ({ proof, message, signer }: Param) => {
  try {
    const signatureProof = Buffer.from(bs58.decode(proof)).toString();

    const [info, signature] = signatureProof.split('-');

    const decodedSignature = Buffer.from(signature, 'base64');

    switch (info) {
      case 'message':
        return ed.sync.verify(
          decodedSignature,
          new TextEncoder().encode(message),
          signer.toBytes()
        );
      case 'tx':
        return validateLedgerAuthTx(
          Transaction.from(decodedSignature),
          message,
          signer
        );
      default:
        return false;
    }
  } catch (e) {
    return false;
  }
};
