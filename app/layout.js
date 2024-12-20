"use client";

import { Provider } from "react-redux";
import "./globals.css";
import store from "@/store/store";
import { Analytics } from "@vercel/analytics/react";

const metadata = {
  title: "hustly.space",
  icons: {
    icon: "/logo-icon.svg",
    apple: "/logo-icon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en">
        <head>
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
