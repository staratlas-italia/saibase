import { Heading } from '@saibase/uikit';
import Head from 'next/head';
import { ShipsRetriever } from "../../components/ShipsRetriever";
import { Translation } from "../../i18n/Translation";
import { ShipList } from './components/ShipList';

const ShipsDealsPage = () => (
  <>
    <Head>
      <title>Ships - StarAtlasItalia</title>
    </Head>

    <ShipsRetriever>
      <div className="space-y-5">
        <Heading>
          <Translation id="Ships.Heading.title" />
        </Heading>

        <ShipList />
      </div>
    </ShipsRetriever>
  </>
);

export default ShipsDealsPage;
