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
      if (!!email && !!token) {
        verifyEmail({ email, token })
          .then((res) => {
            if (res.error_messages) {
              toast.error("Verify Failed!", { autoClose: 1000 });
              setTimeout(() => {
                router.push("/auth-login?verify=false");
              }, 1000);
            } else {
              toast.success("Verify Successful!", { autoClose: 1000 });
              setTimeout(() => {
                router.push("/auth-login?verify=true");
              }, 1000);
            }
          })
          .catch((err) => {
            toast.error("Verify Failed!", { autoClose: 1000 });
            setTimeout(() => {
              router.push("/auth-login?verify=false");
            }, 1000);
          });
      }
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
