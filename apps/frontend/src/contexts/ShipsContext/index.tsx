import { StarAtlasNft } from '@saibase/star-atlas';
import { PropsWithChildren, createContext, useContext } from 'react';
import { useLocalStorage } from '~/hooks/useLocalStorage';

export type ShipsContextState = {
  ships: StarAtlasNft[];
  update: (ships: StarAtlasNft[]) => void;
};

export const ShipsContext = createContext<ShipsContextState>(
  {} as ShipsContextState
);

export const useShipContext = () => useContext(ShipsContext);

export const ShipsProvider = ({ children }: PropsWithChildren) => {
  const [ships, update] = useLocalStorage<StarAtlasNft[]>('ships-v1', []);

  return (
    <ShipsContext.Provider
      value={{
        ships,
        update,
      }}
    >
      {children}
    </ShipsContext.Provider>
  );
};
