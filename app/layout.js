"use client";

import { Provider } from "react-redux";
import "./globals.css";
import store from "@/store/store";

// export const metadata = {
//   title: 'hustly.space',
//   icons: {
//     icon: '/logo-icon.svg',
//     apple: '/logo-icon.svg',
//   },
// };

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
