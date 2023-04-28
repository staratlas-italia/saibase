import invariant from 'invariant';

export const environmentName = process.env.ENVIRONMENT;

invariant(environmentName, 'The environment name is not defined.');
