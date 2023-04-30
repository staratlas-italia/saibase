import { Button, Flex, Price, Text } from '@saibase/uikit';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  DEVNET_TOKEN_SWAP_STATE_ACCOUNTS,
  TOKEN_SWAP_STATE_ACCOUNTS,
} from '~/common/constants';
import { useCluster } from '~/components/ClusterProvider';
import { InfoRow } from '~/components/common/Info';
import { useTokenBalance } from '~/hooks/useTokenBalance';
import { StateAccount } from '~/pages/admin/View';
import { withdrawProceeds } from '~/programs';

type Props = {
  account: StateAccount;
  loading?: boolean;
  onToggle?: () => void;
};

const LinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
    />
  </svg>
);

export const ProgramInstance = ({ account, onToggle, loading }: Props) => {
  const { cluster } = useCluster();
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();

  const addressString = account.publicKey.toString();

  const settings = (
    cluster === 'devnet'
      ? DEVNET_TOKEN_SWAP_STATE_ACCOUNTS
      : TOKEN_SWAP_STATE_ACCOUNTS
  )[addressString];

  const { balance: proceedsBalance, loading: loadingBalance } = useTokenBalance(
    account.account.proceedsVault
  );

  const { balance: vaultBalance, loading: loadingVaultBalance } =
    useTokenBalance(account.account.vault);

  const handleWithdraw = useCallback(async () => {
    if (!anchorWallet) {
      return;
    }

    try {
      await withdrawProceeds(
        cluster,
        connection,
        anchorWallet,
        account.publicKey
      );

      toast.success('Done.');
    } catch (e) {
      toast.error(e.message);
    }
  }, [account.publicKey, anchorWallet, cluster, connection]);

  return (
    <Flex direction="col" key={addressString}>
      <Flex className="bg-blue-900 rounded" p={3} justify="between">
        <Flex direction="col" className="space-y-3">
          <InfoRow title="Swap">
            <Text color="text-white">
              {settings?.name.toUpperCase() || addressString} /{' '}
              {settings?.vaultCurrency}
            </Text>
          </InfoRow>

          <Flex className="space-x-3">
            <Link
              href={`https://solscan.io/account/${account.account.vault.toString()}${
                cluster ? `?cluster=${cluster}` : ''
              }`}
              target="_blank"
            >
              <Text
                weight="bold"
                transform="uppercase"
                size="sm"
                color="text-gray-300"
              >
                <LinkIcon />
                Vault
              </Text>
            </Link>

            <Link
              href={`https://solscan.io/account/${account.account.proceedsVault.toString()}${
                cluster ? `?cluster=${cluster}` : ''
              }`}
              target="_blank"
            >
              <Text
                weight="bold"
                transform="uppercase"
                size="sm"
                color="text-gray-300"
              >
                <LinkIcon />
                Proceeds Vault
              </Text>
            </Link>
          </Flex>
          <Flex className="space-x-5">
            <InfoRow title="Price">
              <Price
                color="text-white"
                currency="USDC"
                decimals={5}
                value={account.account.price.toNumber() / Math.pow(10, 6)}
              />
            </InfoRow>

            <InfoRow title="Proceeds vault" loading={loadingBalance}>
              <Price
                color="text-white"
                currency="USDC"
                value={proceedsBalance || 0}
              />
            </InfoRow>

            <InfoRow title="Vault" loading={loadingVaultBalance}>
              <Price
                currency="NONE"
                color="text-white"
                value={vaultBalance || 0}
              />
            </InfoRow>
          </Flex>
        </Flex>

        <Flex direction="col">
          <Button loading={loading} onClick={onToggle}>
            {account.account.active ? 'Disable' : 'Enable'}
          </Button>

          <Flex pt={3}>
            <Button loading={loading} onClick={handleWithdraw}>
              Withdraw proceeds
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
