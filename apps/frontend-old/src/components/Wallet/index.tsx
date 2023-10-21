import { Flex } from '@saibase/uikit';
import { WalletModal } from '../modals/WalletModal';
import { ConnectButton } from './components/ConnectButton';
import { UserBadge } from './components/UserBadge';

type Props = {
  hideSettings?: boolean;
};

export const Wallet = ({ hideSettings }: Props) => (
  <Flex align="center">
    <ConnectButton />
    <UserBadge showAddress disableSettings={hideSettings} />
    <WalletModal />
  </Flex>
);
