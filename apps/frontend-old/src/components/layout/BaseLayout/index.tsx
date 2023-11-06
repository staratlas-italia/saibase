import { Flex } from '@saibase/uikit';
import React, { PropsWithChildren } from 'react';
import { Background } from '../Background';

export const BaseLayout = React.memo(({ children }: PropsWithChildren) => {
  return (
    <>
      <Background />

      <Flex direction="col" className="h-full overflow-auto w-full" grow={1}>
        {children}
      </Flex>
    </>
  );
});

BaseLayout.displayName = 'BaseLayout';
