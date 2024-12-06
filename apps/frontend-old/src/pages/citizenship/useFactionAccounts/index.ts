import { citizenship } from '@saibase/sai-citizenship';
import { useCluster } from '../../../components/ClusterProvider';
import { useNullableSelf } from '../../../hooks/useNullableSelf';

export const useFactionAccounts = () => {
  const { cluster } = useCluster();
  const { self } = useNullableSelf();

  if (cluster === 'devnet') {
    return citizenship.factionToTokenSwapStateAccounts.devnet;
  }

  return self?.discordId
    ? citizenship.factionToTokenSwapStateAccountsDiscounted['mainnet-beta']
    : citizenship.factionToTokenSwapStateAccounts['mainnet-beta'];
};
