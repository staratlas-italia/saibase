import { FeatureDefinition } from '@growthbook/growthbook';
import axios from 'axios';
import invariant from 'invariant';
import { featuresEndpoint, growthbook } from '../../constants';
import { logger } from '../../logger';

export const fetchFeatureFlags = async (_: string) => {
  invariant(featuresEndpoint, 'The featureEnpoints has an invalid value');

  try {
    const { data } = await axios.get<{
      features: Record<string, FeatureDefinition>;
    }>(`${featuresEndpoint}?t=${Date.now()}`);

    growthbook.setFeatures(data.features);
  } catch (e) {
    logger.log('Failed to load experiments');
  }

  return growthbook;
};
