import invariant from 'invariant';

export const rpcApiBaseUrl = process.env.RPC_API_BASE_URL;

invariant(rpcApiBaseUrl, 'Application rpcApiBaseUrl not found');
