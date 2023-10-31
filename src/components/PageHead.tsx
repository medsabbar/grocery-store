import Head from "next/head";
import React from "react";

const PageHead = ({
  title,
  description,
  locale,
}: {
  title: string;
  description: string;
  locale: string;
}) => {
  const pageTitle = title ? `${title} | Grocery Store` : `Grocery Store`;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta charSet="utf-8" />
      <meta httpEquiv="content-language" content={locale} />
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />
      <link rel="manifest" href="/manifest.json" />
    </Head>
  );
};
export default PageHead;
