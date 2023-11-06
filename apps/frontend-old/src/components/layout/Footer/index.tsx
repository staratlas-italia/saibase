import { Flex } from '@saibase/uikit';
import { Disclaimer } from './components/Disclaimer';
import { Links } from './components/Links';

export const Footer = () => (
  <Flex
    align="center"
    className="z-10 bg-white"
    grow={1}
    py={5}
    px={5}
    justify="center"
    direction="col"
    lgDirection="row"
  >
    <Disclaimer />

    <Links />
  </Flex>
);
