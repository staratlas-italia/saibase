import invariant from 'invariant';
import { featuresEndpoint, growthbook } from '../../constants';
import { logger } from '../../logger';

export const fetchFeatureFlags = async (name: string) => {
  invariant(featuresEndpoint, 'The featureEnpoints has an invalid value');

  try {
    const { features } = await fetch(
      `${featuresEndpoint}?t=${Date.now()}`
    ).then((res) => res.json());

    growthbook.setFeatures(features);
  } catch (e) {
    logger.log('Failed to load experiments');
  }

  return growthbook;
};
