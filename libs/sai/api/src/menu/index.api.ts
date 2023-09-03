import { pipe } from 'fp-ts/function';
import { NextApiRequest, NextApiResponse } from 'next';
import { getMenuItems } from '~/components/layout/SideBarLayout/components/SideBarContent/getMenuItems';
import { matchMethodMiddleware } from '../../../../../apps/frontend/src/middlewares/matchMethod';


 
const fetchMenu = (publicKey: string , locale = "it") => {
  
  return getMenuItems(locale, publicKey);
}
