import { Flex } from '@saibase/uikit';
import { useWallet } from '@solana/wallet-adapter-react';
import React, { PropsWithChildren } from 'react';
import { SelfRetriever } from '../../SelfRetriever';
import { BaseLayout } from '../BaseLayout';
import { Container } from '../Container';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { SideBar } from './components/SideBar';
import { SidebarToggle } from './components/SidebarToggle';
import { TokenAmounts } from './components/TokenAmounts';

export const SideBarLayout = React.memo(
  ({ children }: PropsWithChildren<unknown>) => {
    const { connected } = useWallet();

    return (
      <Flex direction="col" className="w-full overflow-auto">
        <Flex className="min-h-screen">
          <SideBar />

          <BaseLayout>
            <Header />

            <Container>
              <div className="h-full mx-auto pb-32 sm:pb-28 lg:pb-0 lg:px-5">
                <Flex className="space-x-5 lg:space-x-0" pb={5}>
                  <SidebarToggle />

                  {connected && (
                    <SelfRetriever>
                      <TokenAmounts />
                    </SelfRetriever>
                  )}
                </Flex>

                {children}
              </div>
            </Container>
          </BaseLayout>
        </Flex>

        <Flex>
          <Footer />
        </Flex>
      </Flex>
    );
  }
);

SideBarLayout.displayName = 'SideBarLayout';
