import { useWallet } from '@solana/wallet-adapter-react';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { useCallback, useMemo } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { getProofMessage } from '../../utils/getProofMessage';
import { createProof } from './createProof';
import { logCreateProofError } from './logCreateProofError';

export const useUpdateSignature = () => {
  const { signMessage } = useWallet();
  const updateSignature = useAuthStore((s) => s.updateSignature);
  const message = useMemo(() => getProofMessage(), []);

  return useCallback(
    () =>
      pipe(
        createProof({
          message,
          signMessage,
        }),
        TE.fold(
          (err) => T.fromIO(logCreateProofError(err)),
          (bs58EncodedProof) =>
            T.fromIO(() => updateSignature(bs58EncodedProof))
        )
      )(),
    [message, signMessage, updateSignature]
  );
};
