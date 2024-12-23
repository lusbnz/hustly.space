"use client";

import { Provider } from "react-redux";
import "./globals.css";
import store from "@/store/store";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en">
        <head>
          <title>hustly.space</title>
          <link rel="icon" href="/logo-icon.svg" type="image/svg" />
          <meta name="description" content="hustly.space" />
          <meta property="og:title" content="hustly.space" />
          <meta property="og:description" content="hustly.space" />
          <meta property="og:image" content="/logo-icon.svg" />
          <meta property="og:type" content="website" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              url: "https://hustly.space",
              logo: "https://hustly.space/logo-icon.svg",
              name: "hustly.space",
            })}
          </script>
        </head>
        <body>
          <Provider store={store}>{children}</Provider>
          <Analytics />
        </body>
      </html>
    </>
  );
}
