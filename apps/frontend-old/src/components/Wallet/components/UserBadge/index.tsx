import { CogIcon } from '@heroicons/react/outline';
import { Button, Text } from '@saibase/uikit';
import { useWallet } from '@solana/wallet-adapter-react';
import styled from 'styled-components';
import { useModal } from '../../../../contexts/ModalContext';
import { shortenAddress } from '../../../../utils/shortenAddress';
import { Flex } from '../../../layout/Flex';
import { Identicon } from './Identicon';

type Props = {
  iconSize?: number;
  showAddress?: boolean;
  disableSettings?: boolean;
};

const Icon = styled(Identicon)<Props>`
  width: ${(iconSize) => `${iconSize}`}px;
  border-radius: 50;
`;

export const UserBadge = ({
  disableSettings,
  iconSize,
  showAddress,
}: Props) => {
  const { connected, wallet, publicKey } = useWallet();
  const { open } = useModal('wallet-modal');

  let name = showAddress ? shortenAddress(`${publicKey}`) : '';

  if (wallet?.adapter.name && !showAddress) {
    name = wallet.adapter.name;
  }

  if (!wallet || !connected || !publicKey) {
    return null;
  }

  return (
    <Flex className="space-x-2">
      <Button
        kind="neutral"
        size="small"
        iconRight={(props) => (disableSettings ? null : <CogIcon {...props} />)}
        onClick={disableSettings ? undefined : open}
      >
        <Flex className="space-x-2 h-7" align="center">
          <Icon address={publicKey?.toBase58()} iconSize={iconSize} />

          {name && (
            <Text weight="bold" className="text-xs lg:text-base">
              {name}
            </Text>
          )}
        </Flex>
      </Button>
    </Flex>
  );
};
