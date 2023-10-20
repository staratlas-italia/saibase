import { getApiRoute } from '@saibase/routes-api';
import { Cluster } from '@solana/web3.js';
import { api } from "../../api";
import { ConfirmPaymentResponse } from "../../../types/api";

type Param = {
  amount: number;
  cluster: Cluster;
  publicKey: string;
  reference: string;
  signal?: AbortSignal;
};

export const confirmPayment = async ({
  amount,
  cluster,
  publicKey,
  reference,
  signal = new AbortController().signal,
}: Param) => {
  const response = await api.post<ConfirmPaymentResponse>(
    getApiRoute('/api/payment/confirm'),
    {
      body: {
        amount,
        cluster,
        publicKey,
        reference,
      },
      headers: {
        'Content-Type': 'application/json',
      },
      signal,
    }
  );

  return response;
};
