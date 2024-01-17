import { GrowthBookProvider } from '@growthbook/growthbook-react';
import { rpcApiBaseUrl } from '@saibase/configuration';
import { feeCollector, mints } from '@saibase/constants';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FEATURES_ENDPOINT, growthbook } from '../common/constants';
import { ClusterProvider, useCluster } from '../components/ClusterProvider';
import { EasterEgg } from '../components/EasterEgg';
import { EasterEggModal } from '../components/EasterEgg/Modal';
import { HtmlComment } from '../components/HtmlComment';
import { PreloadResources } from '../components/PreloadResources';
import { MainLayout } from '../components/layout/MainLayout';
import { ModalProvider } from '../contexts/ModalContext';
import { ShipsProvider } from '../contexts/ShipsContext';
import { useTranslations } from '../i18n/useTranslations';
import '../styles/globals.css';

const WalletProvider = dynamic(() => import('../contexts/WalletProvider'), {
  ssr: false,
});

const feeMints = [
  mints.atlas,
  mints.bonk,
  mints.bSol,
  mints.ethWormhole,
  mints.jitoSol,
  mints.mSol,
  mints.polis,
  mints.ray,
  mints.srm,
  mints.stSol,
  mints.usdc,
  mints.usdcWormhole,
  mints.usdt,
  mints.uxd,
  mints.wSol,
];

function App({ router, ...props }: AppProps) {
  const translations = useTranslations();

  const { locale } = useRouter();

  const [isJupiterLoaded, setJupiterLoaded] = useState(false);

  const launchTerminal = () => {
    const feeAccounts = new Map();

    for (const mint of feeMints) {
      const account = getAssociatedTokenAddressSync(mint, feeCollector);

      feeAccounts.set(mint.toString(), account);
    }

    window.Jupiter?.init({
      endpoint: rpcApiBaseUrl,
      displayMode: 'widget',
      integratedTargetId: 'integrated-terminal',
      defaultExplorer: 'Solscan',
      containerClassName: 'z-50',
      platformFeeAndAccounts: {
        feeBps: 5,
        feeAccounts,
      },
    });
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined;

    if (!isJupiterLoaded || !window.Jupiter.init || !intervalId) {
      intervalId = setInterval(() => {
        setJupiterLoaded(Boolean(window.Jupiter.init));
      }, 500);
    }

    return () => intervalId && clearInterval(intervalId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (isJupiterLoaded && Boolean(window.Jupiter.init)) {
        launchTerminal();
      }
    }, 200);
  }, [isJupiterLoaded]);

  useEffect(() => {
    if (!FEATURES_ENDPOINT) {
      return;
    }

    fetch(FEATURES_ENDPOINT, { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => {
        growthbook.setFeatures(json.features);

        growthbook.setAttributes({
          url: window.location.href,
          userAgent: navigator.userAgent,
        });
      });
  }, []);

  return (
    <GrowthBookProvider growthbook={growthbook}>
      <HtmlComment text="You're looking at the right place?" />
      <ClusterProvider>
        <IntlProvider
          messages={translations}
          locale={locale || 'it'}
          defaultLocale="it"
        >
          <ModalProvider>
            <WalletProvider>
              <ShipsProvider>
                <div className="z-50">
                  <div
                    id="integrated-terminal"
                    className="z-50 bg-slate-700 rounded-lg max-w-3xl"
                  />
                </div>

                <ToastContainer />

                <MainLayout>
                  <EasterEgg iterations={1} />
                  <EasterEggModal />

                  <Pages {...props} />
                </MainLayout>
              </ShipsProvider>
            </WalletProvider>
          </ModalProvider>
        </IntlProvider>
      </ClusterProvider>
    </GrowthBookProvider>
  );
}

const Pages = ({ Component, pageProps }: Omit<AppProps, 'router'>) => {
  const endpoint = useCluster();

  return (
    <ConnectionProvider endpoint={endpoint.url}>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_KEY}`}
      />
      <Script strategy="lazyOnload" id="tagmanager">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.GOOGLE_ANALYTICS_KEY}');
        `}
      </Script>

      <Script strategy="lazyOnload" id="hotjar">
        {`
          (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:3054503,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}
      </Script>

      <Script src="https://terminal.jup.ag/main-v2.js" data-preload />

      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      <PreloadResources />

      <Component {...pageProps} />
    </ConnectionProvider>
  );
};

export default App;
