import { getPublicRoute } from '@saibase/routes-public';
import { Flex } from '@saibase/uikit';
import { useRouter } from 'next/router';
import { Disclaimer } from "./components/Disclaimer";
import { Links } from "./components/Links";

export const Footer = () => {
  const { pathname } = useRouter();

  if (pathname === getPublicRoute('/mint')) {
    return null;
  }

  return (
    <Flex
      align="center"
      className="z-10 bg-white"
      grow={1}
      py={5}
      px={5}
      justify="center"
    >
      <Flex
        align="center"
        className=" w-full container space-x-3"
        justify="between"
      >
        <Disclaimer />
        <Links />
      </Flex>
    </Flex>
  );
};
