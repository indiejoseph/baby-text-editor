import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { GlobalStyles } from '../styles';

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <>
      <Head>
        <title>Baby Text Editor</title>
        <meta name="description" content="A text editor for baby" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/app512.png" />
        <link rel="apple-touch-icon" sizes="256x256" href="/app256.png" />
        <link rel="apple-touch-icon" sizes="128x128" href="/app128.png" />
        <link rel="apple-touch-icon" sizes="64x64" href="/app64.png" />
        <link rel="apple-touch-icon" sizes="32x32" href="/app32.png" />
      </Head>
      <GlobalStyles />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
