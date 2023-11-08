import { rpcApiBaseUrl } from '@saibase/configuration';
import { feeCollector, mints } from '@saibase/constants';
import { Flex } from '@saibase/uikit';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { useEffect, useState } from 'react';

const feeMints = [
  mints.atlas,
  mints.bonk,
  mints.bSol,
  mints.ethWormhole,
  mints.jitoSol,
  mints.mSol,
  mints.polis,
  mints.ray,
  mints.srm,
  mints.stSol,
  mints.usdc,
  mints.usdcWormhole,
  mints.usdt,
  mints.uxd,
  mints.wSol,
];

function Swapper() {
  useEffect(() => {
    const feeAccounts = new Map();

    for (const mint of feeMints) {
      const account = getAssociatedTokenAddressSync(mint, feeCollector);

      feeAccounts.set(mint.toString(), account);
    }

    window.Jupiter.init({
      endpoint: rpcApiBaseUrl,
      displayMode: 'integrated',
      integratedTargetId: 'integrated-terminal',
      defaultExplorer: 'Solscan',
      platformFeeAndAccounts: {
        feeBps: 20,
        feeAccounts,
      },
    });
  }, []);

  return (
    <Flex align="center" justify="center" className="h-full">
      <div
        id="integrated-terminal"
        className="z-20 bg-slate-700  rounded-lg max-w-3xl"
      />
    </Flex>
  );
}

export default function JupiterSwap() {
  const [render, shouldRender] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.Jupiter) {
        shouldRender(true);

        clearInterval(interval);
        return;
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return render && <Swapper />;
}
