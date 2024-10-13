"use client";

import { verifyEmail } from "@/api/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyEmail = () => {
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const sp = isClient ? new URLSearchParams(window.location.search) : null;
    const email = sp ? sp.get("email") : null;
    const token = sp ? sp.get("token") : null;
    setTimeout(() => {
      verifyEmail(email, token)
        .then((res) => {
          if (res.error_messages) {
            router.push("/auth-login?verify=false");
          } else {
            localStorage.setItem("accessToken", res.access);
            router.push("/news?verify=true");
          }
        })
        .catch((err) => {
          router.push("/auth-login?verify=false");
        });
    }, 1000);
  }, [isClient]);

  return (
    <>
      <div className="w-[100vw] h-[100vh] flex items-center justify-center bg-[#000]">
        <BeatLoader color="#fff" size={16} />
      </div>
      <ToastContainer />
    </>
  );
};

export default VerifyEmail;
