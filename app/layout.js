"use client";

import { Provider } from "react-redux";
import "./globals.css";
import store from "@/store/store";
import Head from "next/head";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/icons/logo-icon.svg" type="image/svg+xml" />
      </Head>
      <body>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
