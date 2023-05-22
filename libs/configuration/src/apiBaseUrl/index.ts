import invariant from 'invariant';

export const apiBaseUrl = process.env.APP_BASE_URL;

invariant(apiBaseUrl, 'Application apiBaseUrl not found');
