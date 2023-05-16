import { PublicRoute } from '@saibase/routes-public';

export type MenuItem = {
  name: string;
  external?: boolean;
  icon: string;
  route: PublicRoute | string;
};
