import { PublicRoute } from '@saibase/routes-public';
import { useRouter } from 'next/router';
import { PropsWithChildren, useMemo } from 'react';
import { BaseLayout } from "../BaseLayout";
import { SideBarLayout } from "../SideBarLayout";

export const MainLayout = ({ children }: PropsWithChildren) => {
  const { pathname } = useRouter();

  const route = pathname as PublicRoute;

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

  return <Layout>{children}</Layout>;
};
