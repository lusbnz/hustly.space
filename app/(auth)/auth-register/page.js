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
import { useForm } from "react-hook-form";
import { authRegister } from "@/api/auth";
import { BeatLoader } from "react-spinners";
import { getAuthToken } from "@/libs/clients";
import Head from "next/head";

const AuthRegister = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    server: "",
  });

  useEffect(() => {
    const accessToken = getAuthToken();

    if (!!accessToken) {
      router.push("/news");
    }
  }, []);

  const onSubmit = () => {
    const data = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    };

    setErrors({ username: "", email: "", password: "", server: "" });

    if (!validatePassword(password)) {
      setErrors((prev) => ({
        ...prev,
        password:
          "Password must contain at least one uppercase letter, one number, and be at least 8 characters long.",
      }));
      return;
    }

    if (!firstName || !lastName) {
      setErrors((prev) => ({
        ...prev,
        username: "Please fill your name",
      }));
      return;
    }

    if (!email) {
      setErrors((prev) => ({
        ...prev,
        email: "Please check your email",
      }));
      return;
    }

    if (!password) {
      setErrors((prev) => ({
        ...prev,
        password: "Please check your password",
      }));
      return;
    }

    setIsLoading(true);
    authRegister(data)
      .then((res) => {
        if (res) {
          if (res.email[0] === "Email đã tồn tại.") {
            setErrors((prev) => ({
              ...prev,
              email: "Email đã tồn tại.",
            }));
            return;
          }

          router.push("/auth-login");
        }
      })
      .catch((err) => {
        console.log(err);
        const errorMessage =
          err.response?.data?.detail ||
          "An unexpected error occurred. Please try again.";

        setErrors((prev) => ({
          ...prev,
          server: errorMessage,
        }));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password); // Kiểm tra có chữ hoa
    const hasLowerCase = /[a-z]/.test(password); // Kiểm tra có chữ thường
    const hasNumber = /\d/.test(password); // Kiểm tra có số
    const hasMinLength = password.length >= 8; // Kiểm tra độ dài >= 8 ký tự

    return hasUpperCase && hasLowerCase && hasNumber && hasMinLength;
  };

  return (
    <>
    <Head>
        <title>hustly.space</title>
        <link rel="icon" href="@/public/icons/logo-icon.svg" />
        <link rel="apple-touch-icon" href="@/public/icons/logo-icon.svg" />
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
            <h1 className="mb-[16px]">Get started</h1>
            <h3>Welcome to hustly.space, where you become a champion</h3>
          </div>
          <div className="form-wrapper">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
            >
              <div className="form-double-item">
                <InputForm
                  title="First name"
                  placeholder="First name..."
                  // register={register}
                  name="first_name"
                  required={true}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setErrors((prev) => ({ ...prev, username: "" }));
                  }}
                />
                <InputForm
                  title="Last name"
                  placeholder="Last name..."
                  // register={register}
                  name="last_name"
                  required={true}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setErrors((prev) => ({ ...prev, username: "" }));
                  }}
                />
              </div>
              {errors.username && (
                <div className="text-[#ff0000] mb-2  text-[12px]">
                  {errors.username}
                </div>
              )}
              <InputForm
                title="Email"
                placeholder="Enter your email..."
                // register={register}
                name="email"
                required={true}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: "" }));
                }}
              />
              {errors.email && (
                <div className="text-[#ff0000] mb-2  text-[12px]">
                  {errors.email}
                </div>
              )}
              <InputForm
                title="Password"
                placeholder="Enter your password..."
                // register={register}
                name="password"
                required={true}
                isPassword={true}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
              />
              {errors.password && (
                <div className="text-[#ff0000] mb-2  text-[12px]">
                  {errors.password}
                </div>
              )}
              {errors.server && (
                <div className="text-[#ff0000] mb-2  text-[12px]">
                  {errors.server}
                </div>
              )}
              <div className="form-footer">
                <ButtonComponent
                  type={"submit"}
                  title={
                    isLoading ? <BeatLoader color="#000" size={6} /> : "Sign up"
                  }
                />
                <span>
                  Already have an account?{" "}
                  <Link className="action" href={"/auth-login"}>
                    Login
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

export default AuthRegister;
