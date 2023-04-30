import { Card, Flex } from '@saibase/uikit';
import classNames from 'classnames';
import { SideBarContent as Content } from '../SideBarContent';
import { Footer } from './components/Footer';

export const SideBar = () => (
  <>
    <div
      className={classNames(
        'z-20 invisible lg:visible min-h-screen fixed w-0 lg:w-64'
      )}
    >
      <Card
        className="rounded-none h-screen"
        direction="col"
        disableRound
        px={2}
        pt={8}
        justify="between"
      >
        <Flex />

        <Content />

        <Footer />
      </Card>
    </div>
  </>
);
