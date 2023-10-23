import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';

export const ReadyProvider = ({
  children,
  fallback,
}: PropsWithChildren<{ fallback: ReactNode }>) => {
  const [didConnect, setDidConnect] = useState(false);

  useEffect(() => {
    console.log(window.xnft);

    window.xnft.on('connect', () => setDidConnect(true));

    window.xnft.on('disconnect', () => setDidConnect(false));
  }, []);

  if (!didConnect) {
    return fallback;
  }

  return children;
};
