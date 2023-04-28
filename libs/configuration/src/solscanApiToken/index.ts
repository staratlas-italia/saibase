import invariant from 'invariant';

export const solscanApiToken = process.env.SOLSCAN_API_TOKEN;

invariant(solscanApiToken, 'The Solscan API token is not defined.');
