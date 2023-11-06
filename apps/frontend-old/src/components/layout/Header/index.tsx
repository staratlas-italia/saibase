import { Flex } from '@saibase/uikit';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Wallet } from '../../Wallet';
import { NewsButton } from './components/NewsButton';

export const Logo = () => (
  <Image
    priority
    src="/images/logo.png"
    height={55.8}
    width={155}
    alt="Start Atlas Italia"
  />
);

export const LogoLink = () => {
  const { locale } = useRouter();
  return (
    <Link href="/" locale={locale}>
      <span className="cursor-pointer">
        <Flex align="center">
          <Logo />
        </Flex>
      </span>
    </Link>
  );
};

type Props = {
  showLogo?: boolean;
};

export const Header = ({ showLogo = false }: Props) => (
  <div className="w-full pb-10 sticky top-0 z-50">
    <Flex align="center" grow={1} py={5} px={5} justify="center">
      <Flex className="z-10 w-full" justify="between">
        {showLogo ? (
          <Flex lgPx={8}>
            <LogoLink />
          </Flex>
        ) : (
          <Flex />
        )}

        <Flex align="center" className="space-x-3">
          <NewsButton />

          <Wallet />
        </Flex>
      </Flex>
    </Flex>
  </div>
);
