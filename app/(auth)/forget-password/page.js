"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Logo from "@/public/images/logo.svg";
import Banner from "@/public/images/banner.png";
import "../styles.css";
import Link from "next/link";
import InputForm from "@/components/common/InputForm";
import ButtonComponent from "@/components/common/ButtonComponent";
import { useRouter } from "next/navigation";
import { authLogin, forgetPassword } from "@/api/auth";
import { BeatLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/reducers/userInfoSlice";
import { getAuthToken } from "@/libs/clients";
import Head from "next/head";

const ForgetPassword = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [Email, setEmail] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    server: "",
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    dispatch(setUserInfo(null));
    const accessToken = getAuthToken();
    if (!!accessToken) {
      router.push("/news");
    }
  }, []);

  const onSubmit = () => {
    setErrors({ email: "", server: "" });

    if (!validateEmail(Email)) {
        setErrors((prev) => ({
          ...prev,
          email: "Please enter a valid email address.",
        }));
        return;
      }

    setIsLoading(true);
    forgetPassword({ email: Email })
      .then((res) => {
        router.push(`/auth-login?forgot=${Email}`);
      })
      .catch((err) => {
        console.log(err);
        setErrors((prev) => ({
          ...prev,
          server: 'Something went wrong. Please try again later.',
        }));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const validateEmail = (email) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const searchParams = isClient
    ? new URLSearchParams(window.location.search)
    : null;
  const rel = searchParams ? searchParams.get("rel") : null;

  return (
    <>
      <Head>
        <title>hustly.space</title>
        <link rel="icon" href="/icons/logo-icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/logo-icon.svg" />
      </Head>
      <div className="w-[100vw] h-[100vh] flex bg-[#000000]">
        <div className="left-container flex-1 flex flex-col">
          <div className="logo-container">
            <Image
              src={Logo}
              alt="logo"
              className="image"
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="form-container">
            <div className="form-header">
              <h1 className="mb-[16px]">Forgot password</h1>
              <h3>Welcome to hustly.space, dong chi</h3>
            </div>
            <div className="form-wrapper">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmit();
                }}
              >
                <InputForm
                  title={"Email"}
                  placeholder={"Enter your email..."}
                  name="email"
                  required={true}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                />
                {errors.email && (
                  <div className="text-[#ff0000] text-[12px]">
                    {errors.email}
                  </div>
                )}
                {errors.server && (
                  <div className="text-[#ff0000] text-[12px]">
                    {errors.server}
                  </div>
                )}
                <div className="form-footer">
                  <ButtonComponent
                    type={"submit"}
                    title={
                      isLoading ? (
                        <BeatLoader color="#000" size={6} />
                      ) : (
                        "Confirm"
                      )
                    }
                  />
                  <span>
                    {`Wait, I remember my password...`}{" "}
                    <Link
                      className="action"
                      href={`/auth-login${rel ? `?rel=${rel}` : ""}`}
                    >
                      Click here
                    </Link>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="flex-1 p-[22px]">
          <Image src={Banner} alt="banner" className="banner-auth" />
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
