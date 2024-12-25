"use client";

import React, { useState } from "react";
import "./layout.css";
import ButtonComponent from "../common/ButtonComponent";
import BackIcon from "@/public/icons/back-icon.svg";
import CameraIcon from "@/public/icons/camera-icon.svg";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import InputForm from "../common/InputForm";
import { changePassword } from "@/api/auth";

const ModalChangePassword = ({ toggleOpenModalSetting }) => {
  const userInfo = useSelector((state) => state.userInfo.userInfo);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [renewPassword, setRenewPassword] = useState("");
  const [errors, setErrors] = useState({
    password: "",
    new_password: "",
    renew_password: "",
  });

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 8;

    return hasUpperCase && hasLowerCase && hasNumber && hasMinLength;
  };

  const { handleSubmit } = useForm({});

  const handleUpdateSetting = (data) => {
    setErrors({
      password: "",
      new_password: "",
      renew_password: "",
    });
    if (!password) {
      setErrors((prev) => ({
        ...prev,
        password: "Password is required.",
      }));
      return;
    }
    if (!newPassword) {
      setErrors((prev) => ({
        ...prev,
        new_password: "New password is required.",
      }));
      return;
    }
    if (!validatePassword(newPassword)) {
      setErrors((prev) => ({
        ...prev,
        new_password:
          "Password must contain at least one uppercase letter, one number, and be at least 8 characters long.",
      }));
      return;
    }
    if (!renewPassword) {
      setErrors((prev) => ({
        ...prev,
        renew_password: "Confirm password is required.",
      }));
      return;
    }
    if (!password || !newPassword || !renewPassword) {
      return;
    }
    if (newPassword === password) {
      setErrors((prev) => ({
        ...prev,
        new_password: "New password cannot be the same as the old password.",
      }));
      return;
    }
    if (newPassword !== renewPassword) {
      setErrors((prev) => ({
        ...prev,
        renew_password: "Passwords do not match.",
      }));
      return;
    }

    const updateData = {
      old_password: password,
      new_password: newPassword,
    };
    changePassword(updateData)
      .then((res) => {
        if (!!res.error_messages) {
          toast.error(res.error_messages);
        } else {
          toast.success("Change password successful!");
          setTimeout(() => {
            toggleOpenModalSetting();
          }, 1000);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black opacity-95 z-20"
        onClick={toggleOpenModalSetting}
      />
      <div className="w-[100vw] h-[90vh] bg-transparent opacity-100 absolute z-30 p-[22px]">
        <div className="w-[532px] h-[90vh] max-h-[100vh] p-[28px] text-white bg-[#171717] rounded-[20px] relative z-50">
          <div className="border-b-[1px] pb-[28px] mb-[22px] border-b-[#212121] flex items-center">
            {userInfo?.is_update_setting && (
              <div
                className="mr-2 cursor-pointer"
                onClick={toggleOpenModalSetting}
              >
                <Image src={BackIcon} alt="back-icon" width={24} height={24} />
              </div>
            )}
            <span className="m-title">Change Password</span>
          </div>
          <div className="mb-[40px] max-h-[70vh] overflow-y-auto pb-12">
            <div className="flex items-center justify-between my-[22px] gap-[12px]">
              <div className="flex items-center gap-[12px]">
                {userInfo?.avatar?.file ? (
                  <div className="m-av rounded-full overflow-hidden w-[90px] h-[90px]">
                    <Image
                      src={userInfo?.avatar?.file}
                      alt="avatar"
                      width={90}
                      height={90}
                      className="rounded-full"
                      style={{
                        height: "100%",
                        width: "100%",
                        objectPosition: "center",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ) : (
                  <div className="relative m-upload bg-[#7a7a7a]">
                    <Image
                      src={CameraIcon}
                      alt="camera-icon"
                      width={24}
                      height={24}
                    />
                  </div>
                )}
                <div className="flex flex-col gap-[6px]">
                  <div className="flex items-center gap-[6px]">
                    <span className="m-name">{userInfo?.first_name}</span>
                    <span className="m-name">{userInfo?.last_name}</span>
                  </div>
                </div>
              </div>
            </div>
            <InputForm
              title={"Current Password"}
              placeholder={"Enter your current password..."}
              name="password"
              required={true}
              isPassword={true}
              isAuth={true}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            {errors.password && (
              <div className="text-[#ff0000] text-[12px] mb-[24px]">
                {errors.password}
              </div>
            )}
            <InputForm
              title={"New Password"}
              placeholder={"Enter New Password..."}
              name="new_password"
              required={true}
              isPassword={true}
              isAuth={true}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
            />
            {errors.new_password && (
              <div className="text-[#ff0000] text-[12px] mb-[24px]">
                {errors.new_password}
              </div>
            )}
            <InputForm
              title={"Re-Enter New Password"}
              placeholder={"Re-Enter New Password..."}
              name="renew_password"
              required={true}
              isPassword={true}
              isAuth={true}
              onChange={(e) => {
                setRenewPassword(e.target.value);
              }}
            />
            {errors.renew_password && (
              <div className="text-[#ff0000] text-[12px] mb-[24px]">
                {errors.renew_password}
              </div>
            )}
          </div>
          <div className="absolute bottom-4 w-[484px] bg-[#171717]">
            <div className="flex items-center gap-[6px] w-100 ">
              {userInfo?.is_update_setting && (
                <ButtonComponent
                  type={"button"}
                  title={"Cancel"}
                  border
                  backgroundColor={"transparent"}
                  color={"#ffffff"}
                  onClick={toggleOpenModalSetting}
                />
              )}
              <ButtonComponent
                type={"submit"}
                title={"Save"}
                onClick={handleSubmit(handleUpdateSetting)}
              />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ModalChangePassword;
