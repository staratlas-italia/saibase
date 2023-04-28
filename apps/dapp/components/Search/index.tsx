import { FormControl, FormErrorMessage, Input } from '@chakra-ui/react';
import { useAtom, useAtomValue } from 'jotai';
import { useRouter } from 'next/router';
import { ChangeEvent, useCallback } from 'react';
import { fetchNftsErrorAtom } from '../../state/nftAtom';
import { searchAtom } from '../../state/searchAtom';

export const Search = () => {
  const [search, setSearch] = useAtom(searchAtom);
  const error = useAtomValue(fetchNftsErrorAtom);
  const { pathname, push } = useRouter();

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);

      if (!error && e.target.value) {
        push(pathname, { query: { q: e.target.value } });
      }
    },
    [setSearch, error]
  );

  return (
    <FormControl isInvalid={Boolean(error)}>
      <Input
        value={search}
        background="white"
        type="text"
        placeholder="Search..."
        onChange={handleChange}
      />

      {error && <FormErrorMessage>{error.error.message}</FormErrorMessage>}
    </FormControl>
  );
};
