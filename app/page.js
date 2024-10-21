"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const rel = searchParams.get("rel");

    if (rel) {
      router.push(`/auth-login?rel=${rel}`);
    } else {
      router.push("/auth-login");
    }
  }, [router]);

  return <></>;
}
