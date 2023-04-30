import { Card, Price } from '@saibase/uikit';
import { usePlayerStore } from '~/stores/usePlayerStore';

export const TokenAmounts = () => {
  const amouts = usePlayerStore((s) => s.amounts);

  if (!amouts) {
    return null;
  }

  const [atlasAmount, polisAmount, usdcAmount] = amouts;

  return (
    <Card wrap="wrap" px={3} py={2} className="lg:space-x-3 space-x-2">
      <Price
        color="text-white"
        currency="ATLAS"
        inverse
        size="xl"
        value={atlasAmount}
      />
      <Price
        color="text-white"
        currency="POLIS"
        inverse
        size="xl"
        value={polisAmount}
      />
      <Price
        color="text-white"
        currency="USDC"
        inverse
        size="xl"
        value={usdcAmount}
      />
    </Card>
  );
};
