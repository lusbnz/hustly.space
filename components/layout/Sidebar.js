"use client";

import React, { use, useEffect, useState } from "react";
import "./layout.css";
import Logo from "@/public/images/logo.svg";
import Image from "next/image";
import Search from "@/public/icons/search-icon.svg";
import Settings from "@/public/icons/settings-icon.svg";
import { usePathname, useRouter } from "next/navigation";
import SelectForm from "../common/SelectForm";
import { memberOptions, p, s } from "@/data/data";

const Sidebar = ({
  toggleOpenModalSetting,
  isSidebarLoading,
  search,
  setFilter,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const university = JSON.parse(localStorage.getItem("university"));
  const userData = JSON.parse(localStorage.getItem("userData"));
  const competion = JSON.parse(localStorage.getItem("competion"));
  const domain = JSON.parse(localStorage.getItem("domain"));
  const [searchValue, setSearchValue] = useState("");
  const[ isClear, setIsClear] = useState(false);

  const handleOpenChat = () => {
    router.replace(`/chats`, undefined, { shallow: true });
  };

  const handleOpenNews = () => {
    router.replace(`/news`, undefined, { shallow: true });
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSubmitSearch = (e) => {
    if (e.key === "Enter") {
      if (searchValue !== "") {
        search(searchValue);
        setSearchValue("");
      }
    }
  };

  const universityOptions = university?.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  const handleChange = (name, value) => {
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClear = () => {
    setFilter(() => ({
      university: "",
      team_member_count: "",
      city: "",
      competition__id: "",
      domain_id: "",
      skill_set: "",
    }));
    setIsClear(true)
  };

  const psOptions = p?.map((item) => {
    return {
      value: item.code,
      label: item.name,
    };
  });

  const competionOptions = competion?.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  const domainOptions = domain?.map((item) => {
    return {
      value: item.id,
      label: item.name,
      subOptions: item.sub_domains.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    };
  });

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
                value={searchValue}
                onChange={handleSearch}
                onKeyDown={handleSubmitSearch}
              />
            </div>
            <div className="sidebar-content">
              <SelectForm
                label={"University"}
                placeholder={"University"}
                options={universityOptions}
                name={"university"}
                isClear={isClear}
                handleChange={handleChange}
              />
              <SelectForm
                label={"Competion"}
                placeholder={"Competion"}
                options={competionOptions}
                name={"competition__id"}
                handleChange={handleChange}
                isClear={isClear}
              />
              <SelectForm
                label={"City"}
                placeholder={"City"}
                name={"city"}
                options={psOptions}
                handleChange={handleChange}
                isClear={isClear}
              />
              <SelectForm
                label={"Team Member"}
                placeholder={"Team Member"}
                options={memberOptions}
                name={"team_member_count"}
                handleChange={handleChange}
                isClear={isClear}
              />
              <SelectForm
                label={"Domain"}
                placeholder={"Domain"}
                options={domainOptions}
                name={"domain_id"}
                isClear={isClear}
                handleChange={handleChange}
              />
              <SelectForm
                label={"Skill set"}
                placeholder={"Skill set"}
                name={"skill_set"}
                options={s}
                isClear={isClear}
                handleChange={handleChange}
              />
              <div
                className="mt-[12px] text-[14px] lh-1 bg-[#222] rounded-[4px] p-[4px] text-white w-[90px] cursor-pointer flex items-center justify-center"
                onClick={handleClear}
              >
                Clear all
              </div>
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
