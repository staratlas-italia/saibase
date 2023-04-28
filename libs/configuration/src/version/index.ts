import invariant from 'invariant';

export const appVersion = process.env.APP_VERSION || '0.1.0';

invariant(appVersion, 'The app version is not defined.');
