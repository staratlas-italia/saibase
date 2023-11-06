import { Flex, Text } from '@saibase/uikit';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { appendQueryParams } from '../../../../../utils/appendQueryParams';
import { MenuItem } from '../SideBar/types';
import { getMenuItems } from './getMenuItems';

export const SideBarContent = () => {
  const { publicKey } = useWallet();
  const { locale, query } = useRouter();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const run = async () => {
      const items = await getMenuItems(locale!, publicKey?.toString());

      setMenuItems(items);
    };

    run();
  }, [publicKey, locale]);

  return (
    <Flex
      align="start"
      justify="center"
      direction="col"
      lgPx={5}
      className="lg:space-y-5 space-y-10"
    >
      {menuItems.map((item, index) => (
        <Link
          key={index.toString()}
          href={appendQueryParams(
            item.route,
            query as Record<string, string | number>
          )}
          target={item.external ? '_blank' : undefined}
        >
          <Flex
            align="center"
            px={4}
            py={2}
            className="space-x-10 lg:space-x-5 hover:bg-gray-200 hover:bg-opacity-10 rounded-3xl "
          >
            <Image
              alt="sidebar icon"
              src={item.icon}
              width={20}
              height={20}
              className="lg:h-5 lg:w-5 h-10 w-10"
            />

            <Text
              className="lg:text-base text-5xl lg:font-moedium font-semibold"
              color="text-white"
            >
              {item.name}
            </Text>
          </Flex>
        </Link>
      ))}
    </Flex>
  );
};
