import { Flex } from '@saibase/uikit';
import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';
import { Background } from '../Background';
import { Footer } from '../Footer';

type Props = { hasSidebar?: boolean };

export const BaseLayout = React.memo(
  ({ children, hasSidebar }: PropsWithChildren<Props>) => {
    return (
      <>
        <Background />

        <div className="relative min-h-screen">{children}</div>

        <Flex className={classNames('mx-auto', { 'lg:pl-64': hasSidebar })}>
          <Footer />
        </Flex>
      </>
    );
  }
);

BaseLayout.displayName = 'BaseLayout';
