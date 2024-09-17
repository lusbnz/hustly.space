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

const AuthLogin = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/news");
  };

  return (
    <div className="w-[100vw] h-[100vh] flex bg-[#000000]">
      <div className="left-container flex-1 flex flex-col">
        <div className="logo-container">
          <Image src={Logo} alt="logo" className="image" style={{objectFit: 'contain'}}/>
        </div>
        <div className="form-container">
          <div className="form-header">
            <h1 className="mb-[16px]">Login account</h1>
            <h3>Welcome to Hustly.space, Lets create your account</h3>
          </div>
          <div className="form-wrapper">
            <form>
              <InputForm title={"Email"} placeholder={"Enter your email..."} />
              <InputForm
                title={"Password"}
                placeholder={"Enter your password..."}
              />
              <div className="form-footer">
                <ButtonComponent
                  type={"button"}
                  title={"Login"}
                  onClick={handleLogin}
                />
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
        <Image src={Banner} alt="banner" className="banner-auth"/>
      </div>
    </div>
  );
};

export default AuthLogin;
