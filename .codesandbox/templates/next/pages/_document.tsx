import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html dir="ltr" lang="en">
      <Head>
        <meta name="description" content="fabric sandbox" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
