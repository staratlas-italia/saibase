import { Flex } from '@saibase/uikit';
import { EmptyView } from '~/components/EmptyView';
import { useFleet } from '~/hooks/useNullableFleet';
import { ShipCard } from './components/Card';

export const Fleet = () => {
  const fleet = useFleet();

  return (
    <>
      {!fleet?.length ? (
        <EmptyView title="No ships found" />
      ) : (
        <>
          <Flex
            justify="center"
            direction="col"
            className="grid grid-cols-1 xl:grid-cols-2 gap-5"
          >
            {fleet.map((fleetData) => (
              <ShipCard key={fleetData?.ship?.mint} {...fleetData} />
            ))}
          </Flex>
        </>
      )}
    </>
  );
};
