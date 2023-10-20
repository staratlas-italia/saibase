import { Button, Flex, StarAtlasShip } from '@saibase/uikit';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useShips } from "../../../../hooks/useShips";
import { Translation } from "../../../../i18n/Translation";

export const ShipList = () => {
  const { ships } = useShips();
  const { locale } = useRouter();
  return (
    (<Flex
      justify="center"
      direction="col"
      className="grid grid-cols-1 xl:grid-cols-2 gap-5"
    >
      {ships.map((ship) => {
        const url = ship.markets.length
          ? `https://play.staratlas.com/market/${ship.name
              .toLowerCase()
              .replace(/\s/g, '-')}`
          : null;

        return (
          <StarAtlasShip
            key={ship._id}
            showDesc
            ship={ship}
            bottomContent={
              <Flex direction="col" className="space-y-2">
                {url && (
                  <Flex direction="col">
                    <Link href={url} target="_blank" rel="noreferrer">
                      <Button
                        kind="primary"
                        as="div"
                        className="w-full lg:w-auto"
                      >
                        <Translation id="Ships.List.Card.BuyAction.title" />
                      </Button>
                    </Link>
                  </Flex>
                )}

                <Flex direction="col">
                  <Link
                    href={{
                      pathname: '/ships/[id]',
                      query: { id: ship?._id },
                    }}
                    locale={locale}
                    className="w-full lg:w-auto"
                  >
                    <Button kind="tertiary" as="div">
                      <Translation id="Ships.List.Card.ReadMore.title" />
                    </Button>
                  </Link>
                </Flex>
              </Flex>
            }
          />
        );
      })}
    </Flex>)
  );
};
