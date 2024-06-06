import {
  QUATTRINO_TO_TOKEN_SWAP_STATE_ACCOUNTS,
  quattrinoAccounts,
} from '../../../common/constants/quattrino';

export const useQuattrinoAccounts = () => {
  return {
    accounts: QUATTRINO_TO_TOKEN_SWAP_STATE_ACCOUNTS,
    states: quattrinoAccounts['mainnet-beta'].normal,
  };
};
