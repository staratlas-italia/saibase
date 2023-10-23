import { Button, ButtonProps } from '@saibase/uikit';
import { useWallet } from '@solana/wallet-adapter-react';
import { constVoid } from 'fp-ts/function';
import { useCallback } from 'react';
import { useModal } from '../../../../contexts/ModalContext';
import { Translation } from '../../../../i18n/Translation';

export const ConnectButton = ({
  kind = 'neutral',
}: {
  kind?: ButtonProps['kind'];
}) => {
  const { open } = useModal('wallet-modal');
  const { wallet, connect, connected } = useWallet();

  const handleClick = useCallback(() => {
    wallet ? connect().catch(constVoid) : open();
  }, [wallet, connect, open]);

  if (!wallet || !connected) {
    return (
      <div>
        <Button kind={kind} size="small" onClick={handleClick}>
          <Translation id="Layout.Wallet.Connect.title" />
        </Button>
      </div>
    );
  }

  return null;
};
