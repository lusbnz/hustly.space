"use client";

import { Provider } from "react-redux";
import "./globals.css";
import store from "@/store/store";
import Head from "next/head";

export default function RootLayout({ children }) {
  return (
    <>
      <Head>
        <title>hustly.space</title>
        <link rel="icon" href="/icons/logo-icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/logo-icon.svg" />
      </Head>
      <html lang="en">
        <body>
          <Provider store={store}>{children}</Provider>
        </body>
      </html>
    </>
  );
}
