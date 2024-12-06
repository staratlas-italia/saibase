import { getApiRoute } from '@saibase/routes-api';
import { captureException } from '@sentry/nextjs';
import { Cluster } from '@solana/web3.js';
import { ScoreFleetResponse } from '../../types/api';
import { appendQueryParams } from '../../utils/appendQueryParams';
import { fillUrlParameters } from '../../utils/fillUrlParameters';
import { api } from '../api';

export const fetchPlayerStakeShips = async (
  cluster: Cluster,
  publicKey: string
) => {
  try {
    const url = appendQueryParams(
      fillUrlParameters(getApiRoute('/api/score/:publicKey'), {
        publicKey,
      }),
      { cluster }
    );

    return await api.get<ScoreFleetResponse>(url);
  } catch (e) {
    captureException(e, { level: 'error' });

    return { success: false, error: 'An error occured' } as ScoreFleetResponse;
  }
};
