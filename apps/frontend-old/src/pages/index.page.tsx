import { getPublicRoute } from '@saibase/routes-public';
import { useWallet } from '@solana/wallet-adapter-react';
import Head from 'next/head';
import { useMemo } from 'react';
import { Redirect } from '../components/common/Redirect';
import { HomePage } from '../views/Home';

const Home = () => {
  const { connected } = useWallet();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initiallyConnected = useMemo(() => connected, []);

  if (initiallyConnected) {
    return <Redirect to={getPublicRoute('/dashboard')} />;
  }

  return (
    <>
      <Head>
        <title>Home - StarAtlasItalia</title>
      </Head>

      <HomePage />
    </>
  );
};

export default Home;
