import invariant from 'invariant';
import { match } from 'ts-pattern';
import { environmentName } from './environmentName';

invariant(
  ['development', 'production'].includes(environmentName),
  `Environment not valid. Current value is ${environmentName}`
);

export type Environment = {
  development: boolean;
  production: boolean;
};

const getEnvironment = (): Environment =>
  match(environmentName)
    .with('development', 'test', () => ({
      development: true,
      production: false,
    }))
    .otherwise(() => ({
      development: false,
      production: true,
    }));

export const environment = getEnvironment();

export { environmentName } from './environmentName';
