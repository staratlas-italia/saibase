import { Box, Container, Flex, Grid } from '@chakra-ui/react';
import {
  appVersion,
  rpcApiBaseUrl,
} from '@saibase/configuration';
import { getNftsByOwner, parsePublicKey } from '@saibase/web3';
import { Connection } from '@solana/web3.js';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { match, P } from 'ts-pattern';
import { Search } from '../components/Search';
import { fetchNftsErrorAtom, nftsAtom } from '../state/nftAtom';
import { searchAtom } from '../state/searchAtom';

export const customGetNftByOwner = (connection: Connection, pk: string) =>
  pipe(
    parsePublicKey(pk),
    TE.fromEither,
    TE.chainW((owner) =>
      getNftsByOwner({
        connection,
        owner,
      })
    )
  );

const HomePage = () => {
  const search = useAtomValue(searchAtom);
  const setError = useSetAtom(fetchNftsErrorAtom);
  const [nfts, setNfts] = useAtom(nftsAtom);

  const fetchNfts = useCallback(() => {
    const connection = new Connection(rpcApiBaseUrl);

    pipe(
      customGetNftByOwner(connection, search),
      TE.match(setError, (nfts) => {
        setError(false);
        setNfts(nfts);
      })
    )();
  }, [search, setError, setNfts]);

  useEffect(() => {
    if (!search) {
      return;
    }

    fetchNfts();
  }, [fetchNfts, search]);

  // if (error) {
  //   match(error)
  //     .with({ type: 'NftFetchByOwnerError' }, ({ error }) => (
  //       <>{error.message}</>
  //     ))
  //     .otherwise(({ error }) => <>Uff {error.message}</>);
  // }

  return (
    <Flex bgGradient="linear(to-r, teal.500, green.500)" h="100vh">
      <Container maxWidth="640px" pt={48}>
        <Box bg="white" p={8} rounded={8}>
          <Flex pb={4}>
            <Search />
          </Flex>

          <Grid templateColumns="repeat(4, 1fr)" gap={4}>
            {nfts
              ? nfts.map((nft) =>
                  match(nft)
                    .with({ json: P.nullish }, () => null)
                    .with({ model: 'nft' }, (nft) => (
                      <Flex key={nft.mint.address.toString()}>
                        <img
                          alt={nft.json.name}
                          src={nft.json.image}
                          width={100}
                          height={100}
                        />
                      </Flex>
                    ))
                    .with({ model: 'sft' }, (sft) => (
                      <Flex key={sft.mint.address.toString()}>
                        <img
                          alt={sft.json.name}
                          src={sft.json.image}
                          width={100}
                          height={100}
                        />
                      </Flex>
                    ))
                    .exhaustive()
                )
              : 'Loading...'}
          </Grid>
          {appVersion}
        </Box>
      </Container>
    </Flex>
  );
};

export default HomePage;
