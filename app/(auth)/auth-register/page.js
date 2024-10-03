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

const AuthRegister = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const accessToken = getAuthToken();

    // if (!!accessToken) {
    //   router.push("/news");
    // }
  }, []);

  const onSubmit = (data) => {
    if (!validatePassword(data.password)) {
      setError("password", {
        type: "manual",
        message:
          "Password must contain at least one uppercase letter, one number, and be at least 8 characters long.",
      });
      return;
    }

    setIsLoading(true);
    authRegister(data)
      .then((res) => {
        if (res) {
          if(res.email[0] === "Email đã tồn tại."){
            setError("server", {
              type: "manual",
              message: "Email already exists.",
            });
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

        setError("server", {
          type: "manual",
          message: errorMessage,
        });
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-double-item">
                <InputForm
                  title="First name"
                  placeholder="First name..."
                  register={register}
                  name="first_name"
                  required={true}
                />
                <InputForm
                  title="Last name"
                  placeholder="Last name..."
                  register={register}
                  name="last_name"
                  required={true}
                />
              </div>
              {(errors.first_name || errors.last_name) && (
                <div className="text-[#ff0000] mb-2 ">
                  Please fill your name
                </div>
              )}
              <InputForm
                title="Email"
                placeholder="Enter your email..."
                register={register}
                name="email"
                required={true}
              />
              {errors.email && (
                <div className="text-[#ff0000] mb-2 ">
                  Please check your email
                </div>
              )}
              <InputForm
                title="Password"
                placeholder="Enter your password..."
                register={register}
                name="password"
                required={true}
                isPassword={true}
              />
              {errors.password && (
                <div className="text-[#ff0000] mb-2 ">
                  {errors.password.message}
                </div>
              )}
              {errors.server && (
                <div className="text-[#ff0000] mb-2 ">
                  {errors.server.message}
                </div>
              )}
              <div className="form-footer">
                <ButtonComponent
                  type={"button"}
                  onClick={handleSubmit(onSubmit)}
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
  );
};

export default AuthRegister;
