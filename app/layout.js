import "./globals.css";

export const metadata = {
  title: "Hustly Space",
  description: "Generated by Dots Lab",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}