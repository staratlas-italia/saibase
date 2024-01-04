import Head from 'next/head';
import { SwapStateAccountGuard } from '../../../../components/SwapStateAccountGuard';
import { useRefreshAlert } from '../../../../hooks/useRefreshAlert';

import { BadgesRetriever } from '../../../../components/BadgesRetriever';
import { View } from './components/View';

const Citizenship = () => {
  useRefreshAlert();

  return (
    <>
      <Head>
        <title>Citizenship - StarAtlasItalia</title>
      </Head>

      <BadgesRetriever>
        <SwapStateAccountGuard>
          <View />
        </SwapStateAccountGuard>
      </BadgesRetriever>
    </>
  );
};

export default Citizenship;
