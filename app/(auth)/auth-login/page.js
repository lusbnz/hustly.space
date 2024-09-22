"use client";

import Image from "next/image";
import React from "react";
import Logo from "@/public/images/logo.svg";
import Banner from "@/public/images/banner.png";
import "../styles.css";
import Link from "next/link";
import InputForm from "@/components/common/InputForm";
import ButtonComponent from "@/components/common/ButtonComponent";
import { useRouter } from "next/navigation";
import { authLogin } from "@/api/auth";
import { useForm } from "react-hook-form";

const AuthLogin = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    authLogin(data)
      .then((res) => {
        if (res) {
          localStorage.setItem("accessToken", res.access);
          router.push("/news");
        }
      })
      .catch((err) => {
        console.log(err);
      });
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
            <h1 className="mb-[16px]">Login account</h1>
            <h3>Welcome to Hustly.space, Lets create your account</h3>
          </div>
          <div className="form-wrapper">
            <form onSubmit={handleSubmit(onSubmit)}>
              <InputForm
                title={"Email"}
                placeholder={"Enter your email..."}
                register={register}
                name="username"
                required={true}
              />
              <InputForm
                title={"Password"}
                placeholder={"Enter your password..."}
                register={register}
                name="password"
                required={true}
              />
              {(errors.username || errors.password) && (
                <div className="text-[#ff0000]">Please fill out all fields</div>
              )}
              <div className="form-footer">
                <ButtonComponent type={"submit"} title={"Login"} />
                <span>
                  Already have an account?
                  <Link className="action" href={"/auth-register"}>
                    Create my account
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

export default AuthLogin;
