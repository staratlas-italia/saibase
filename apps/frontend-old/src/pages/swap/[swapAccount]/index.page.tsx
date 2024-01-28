import Head from 'next/head';
import { BadgesRetriever } from '../../../components/BadgesRetriever';
import { SwapStateAccountGuard } from '../../../components/SwapStateAccountGuard';
import { View } from './components/View';

const TokenSwap = () => {
  return (
    <>
      <Head>
        <title>Swap - StarAtlasItalia</title>
      </Head>

      <BadgesRetriever>
        <SwapStateAccountGuard>
          <View />
        </SwapStateAccountGuard>
      </BadgesRetriever>
    </>
  );
};

export default TokenSwap;
