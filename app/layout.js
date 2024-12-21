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
        </head>
        <body>
          <Provider store={store}>{children}</Provider>
          <Analytics />
        </body>
      </html>
    </>
  );
}
