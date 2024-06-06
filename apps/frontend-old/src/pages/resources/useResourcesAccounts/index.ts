import {
  DEVNET_RESOURCES_TO_TOKEN_SWAP_STATE_ACCOUNTS,
  resourceAccounts,
  RESOURCES_TO_TOKEN_SWAP_STATE_ACCOUNTS,
} from '../../../common/constants/resources-swap';
import { useCluster } from '../../../components/ClusterProvider';

export const useResourcesAccounts = () => {
  const { cluster } = useCluster();

  if (cluster === 'devnet') {
    return {
      accounts: DEVNET_RESOURCES_TO_TOKEN_SWAP_STATE_ACCOUNTS,
      states: resourceAccounts.devnet.normal,
    };
  }

  return {
    accounts: RESOURCES_TO_TOKEN_SWAP_STATE_ACCOUNTS,
    states: resourceAccounts['mainnet-beta'].normal,
  };
};

export default useResourcesAccounts;
