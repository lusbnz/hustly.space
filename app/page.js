"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/auth-login");
  }, [router]);

  return (
    <>
      <Head>
        <title>hustly.space</title>
        {/* <meta property="og:image" content="/icons/logo-icon.svg" />
        <link rel="icon" href="/icons/logo-icon.svg" /> */}
      </Head>
    </>
  );
}
