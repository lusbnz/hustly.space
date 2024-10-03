"use client";

import { Provider } from "react-redux";
import "./globals.css";
import store from "@/store/store";
import logo from '@/public/icons/logo-icon.svg';

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en">
        <body>
          <Provider store={store}>{children}</Provider>
        </body>
      </html>
    </>
  );
}
