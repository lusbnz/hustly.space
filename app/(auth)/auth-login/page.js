import Image from "next/image";
import React from "react";
import Logo from "@/public/images/logo.png";
import Banner from "@/public/images/banner.png";
import "../styles.css";

const AuthLogin = () => {
  return (
    <div className="w-[100vw] h-[100vh] flex">
      <div className="left-container flex-1 flex flex-col">
        <div className="logo-container">
          <Image src={Logo} alt="logo" className="logo-auth" />
        </div>
        <div className="form-container">
          <div className="form-header">
            <h1 className="mb-[16px]">Login account</h1>
            <h3>Welcome to Hustly.space, Lets create your account</h3>
          </div>
          <div className="form-wrapper">
            <form>
              <div className="form-item">
                <label>
                  Email
                </label>
                <input placeholder="Enter your email..."/>
              </div>

              <div className="form-item">
                <label>
                  Password
                </label>
                <input placeholder="Enter your password..."/>
              </div>

              <div className="form-footer">
                <button type="submit">Login</button>
                <span>Already have an account? <a href="#">Create my account</a></span>
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