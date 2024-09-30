"use client";

import { Provider } from "react-redux";
import "./globals.css";
import store from "@/store/store";
import logo from '@/public/icons/logo-icon.svg';

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en">
        <head>
          <title>hustly.space</title>
          <link rel="icon" href={logo} type="icon/svg+xml" />
        </head>
        <body>
          <Provider store={store}>{children}</Provider>
        </body>
      </html>
    </>
  );
}
