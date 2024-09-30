"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import logo from '@/public/icons/logo-icon.svg';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/auth-login");
  }, [router]);

  return (
    <>
      <Head>
        <title>hustly.space</title>
        <link rel="icon" href={logo} type="icon/svg+xml" />
      </Head>
    </>
  );
}
