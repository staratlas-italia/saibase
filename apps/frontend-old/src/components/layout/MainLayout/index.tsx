import { Flex } from '@saibase/uikit';
import { useRouter } from 'next/router';
import { PropsWithChildren, useMemo } from 'react';
import { Routes } from '../../../utils/getRoute';
import { BaseLayout } from '../BaseLayout';
import { SideBarLayout } from '../SideBarLayout';

export const MainLayout = ({ children }: PropsWithChildren) => {
  const { pathname } = useRouter();

  const route = pathname as Routes;

  const Layout = useMemo(() => {
    switch (route) {
      case '/admin':
      case '/dashboard':
      case '/ships':
      case '/ships/deals':
        return SideBarLayout;
      default:
        return BaseLayout;
    }
  }, [route]);

  return (
    <Flex className="h-screen overflow-hidden">
      <Layout>{children}</Layout>
    </Flex>
  );
};
