"use client";

import React, { use, useEffect, useState } from "react";
import "./layout.css";
import Logo from "@/public/images/logo.svg";
import Image from "next/image";
import Search from "@/public/icons/search-icon.svg";
import Settings from "@/public/icons/settings-icon.svg";
import { usePathname, useRouter } from "next/navigation";
import SelectForm from "../common/SelectForm";

const Sidebar = ({ toggleOpenModalSetting, isSidebarLoading }) => {
  const router = useRouter();
  const pathname = usePathname();
  const userData = JSON.parse(localStorage.getItem("userData"));

  const handleOpenChat = () => {
    router.replace(`/chats`, undefined, { shallow: true });
  };

  const handleOpenNews = () => {
    router.replace(`/news`, undefined, { shallow: true });
  };

  return (
    <>
      <div className="h-100 bg-[#171717] rounded-[20px] sidebar-wrapper">
        {isSidebarLoading ? (
          <>
            <div className="w-100 h-[100vh] flex items-center justify-center text-white font-[500] text-[24px]">
              Loading...
            </div>
          </>
        ) : (
          <>
            <div className="sidebar-header">
              <div className="sb-wrapper">
                <div className="logo-container" onClick={handleOpenNews}>
                  <Image
                    src={Logo}
                    alt="logo"
                    className="image"
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="search-container" onClick={handleOpenChat}>
                  <Image
                    src={Search}
                    alt="search"
                    className="image"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
              <input
                type="text"
                placeholder="Search for anything..."
                className="search-input rounded-[8px] h-[52px]"
              />
            </div>
            <div className="sidebar-content">
            <SelectForm label={"University"} placeholder={"University"} />
              <SelectForm label={"Competion"} placeholder={"Competion"} />
              <SelectForm label={"City"} placeholder={"City"} />
              <SelectForm label={"Team Member"} placeholder={"Team Member"} />
              <SelectForm label={"Domain"} placeholder={"Domain"} />
              <SelectForm label={"Skill set"} placeholder={"Skill set"} />
            </div>
            <div className="sidebar-footer">
              {userData?.avatar ? (
                <div className="avatar-image">
                  <Image
                    src={userData?.avatar?.file}
                    alt="avatar"
                    className="avatar-image"
                    width={64}
                    height={64}
                    objectFit="cover"
                  />
                </div>
              ) : (
                <div className="avatar"></div>
              )}
              <div className="flex flex-col info">
                <span className="title">
                  {userData?.first_name?.length > 15
                    ? userData?.first_name?.slice(0, 15) + "..."
                    : userData?.first_name}{" "}
                  {userData?.last_name}
                </span>
                <span className="setting" onClick={toggleOpenModalSetting}>
                  <div className="settings-container">
                    <Image src={Settings} alt="settings" className="image" />
                  </div>
                  Profile Setting
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Sidebar;
