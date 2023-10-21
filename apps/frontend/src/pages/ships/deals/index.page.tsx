import { Button, Flex, Heading, Loader } from '@saibase/uikit';
import Head from 'next/head';
import { ShipsRetriever } from "../../../components/ShipsRetriever";
import { useShips } from "../../../hooks/useShips";
import { Translation } from "../../../i18n/Translation";
import { useShipsDealsStore } from "../../../stores/useShipsDealsStore";
import { ShipTable } from '../components/ShipTable';

const Refresh = () => {
  const { ships } = useShips();
  const { fetch, isFetching } = useShipsDealsStore();

  return (
    <Flex align="center" className="space-x-2">
      {isFetching && <Loader color="text-white" />}

      <Button size="small" onClick={() => fetch(ships, true)}>
        <Translation id="Admin.Stats.Refresh.action.title" />
      </Button>
    </Flex>
  );
};

const ShipsDealsPage = () => (
  <>
    <Head>
      <title>Ships Deals - StarAtlasItalia</title>
    </Head>

    <ShipsRetriever>
      <div className="space-y-5">
        <Heading rightContent={<Refresh />}>
          <Translation id="Ships.Heading.title" />
        </Heading>

        <ShipTable />
      </div>
    </ShipsRetriever>
  </>
);

export default ShipsDealsPage;
