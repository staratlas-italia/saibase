import { Flex } from '@saibase/uikit';
import classNames from 'classnames';
import { BlurBackground } from '../../../BlurBackground';
import { LogoLink } from '../../../Header';
import { SideBarContent as Content } from '../SideBarContent';
import { Footer } from './components/Footer';

export const SideBar = () => (
  <div className={classNames('z-10 hidden lg:flex')}>
    <BlurBackground
      className="rounded-none h-screen w-64"
      direction="col"
      disableRound
      px={2}
      pt={8}
      grow={1}
      justify="between"
    >
      <Flex lgPx={8}>
        <LogoLink />
      </Flex>

      <Flex className="overflow-scroll py-4">
        <Content />
      </Flex>

      <Footer />
    </BlurBackground>
  </div>
);
