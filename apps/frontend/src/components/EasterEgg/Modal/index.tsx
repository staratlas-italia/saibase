import { useState } from 'react';

import { Flex } from '@saibase/uikit';
import { EasterEggDone } from "./Done";
import { Kittens } from "./Kittens";
import { BaseModal } from "../../modals/BaseModal";

export const EasterEggModal = () => {
  const [done, setDone] = useState(false);

  return (
    <BaseModal
      id="easter-egg"
      size={done ? 'regular' : 'large'}
      onClose={() => setDone(false)}
    >
      <Flex direction="col" px={5} py={8}>
        {done ? (
          <EasterEggDone />
        ) : (
          <Kittens onComplete={() => setDone(true)} />
        )}
      </Flex>
    </BaseModal>
  );
};
