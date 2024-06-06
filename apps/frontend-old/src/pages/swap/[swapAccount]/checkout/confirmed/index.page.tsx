import Head from 'next/head';
import { BadgesRetriever } from '../../../../../components/BadgesRetriever';
import { SwapStateAccountGuard } from '../../../../../components/SwapStateAccountGuard';
import { View } from './View';

const CitizenshipConfirmed = () => (
  <>
    <Head>
      <title>Confirm Citizenship - StarAtlasItalia</title>
    </Head>

    <BadgesRetriever>
      <SwapStateAccountGuard>
        <View />
      </SwapStateAccountGuard>
    </BadgesRetriever>
  </>
);

export default CitizenshipConfirmed;
