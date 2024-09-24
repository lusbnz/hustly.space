"use client";

import React, { use, useEffect, useState } from "react";
import "./layout.css";
import Logo from "@/public/images/logo.svg";
import Image from "next/image";
import Search from "@/public/icons/search-icon.svg";
import UserIcon from "@/public/icons/user-icon.svg";
import UniversityIcon from "@/public/icons/university-icon.svg";
import CupIcon from "@/public/icons/cup-icon.svg";
import DomainIcon from "@/public/icons/domain-icon.svg";
import SkillIcon from "@/public/icons/skill-icon.svg";
import PlaceIcon from "@/public/icons/place-icon.svg";
import SignoutIcon from "@/public/icons/sign-out.svg";
import Settings from "@/public/icons/settings-icon.svg";
import { usePathname, useRouter } from "next/navigation";
import SelectForm from "../common/SelectForm";
import { memberOptions, p, s } from "@/data/data";
import { useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";

const Sidebar = ({
  toggleOpenModalSetting,
  isSidebarLoading,
  search,
  filter,
  setFilter,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const university = useSelector((state) => state.university);
  const userInfo = useSelector((state) => state.userInfo);
  const competition = useSelector((state) => state.competition);
  const domain = useSelector((state) => state.domain);
  const [searchValue, setSearchValue] = useState("");
  const [isClear, setIsClear] = useState(false);
  const [ageV, setAgeV] = useState({ min: 18, max: 25 });

  const handleChangeAge = (rangeValue) => {
    setAgeV(rangeValue);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilter({
        ...filter,
        age__gte: ageV.min,
        age__lte: ageV.max,        
      });
    }, 1000);

    return () => clearTimeout(timer); 
  }, [ageV]);

  const handleOpenChat = (e) => {
    router.push(`/chats`);
  };

  const handleOpenNews = (e) => {
    router.push(`/news`);
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

  const handleChangeFilter = (name, value) => {
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClear = () => {
    setFilter(() => ({
      university__id: "",
      team_member_count: "",
      city: "",
      competition__id: "",
      domain__id: "",
      skill_set: "",
      age__gte: filter.age__gte,
      age__lte: filter.age__lte,
    }));
    setIsClear(true);
  };

  const psOptions = p?.map((item) => {
    return {
      value: item.code,
      label: item.name,
    };
  });

  const competitionOptions = competition?.map((item) => {
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

  const handleSignout = () => {
    localStorage.removeItem("accessToken");
    router.push("/auth-login");
  };

  return (
    <>
      <div className="h-[95vh] bg-[#171717] rounded-[20px] sidebar-wrapper">
        {isSidebarLoading ? (
          <>
            <div className="w-100 h-[100vh] flex items-center justify-center text-white font-[500] text-[24px]">
              <BeatLoader size={10} color="#fff" />
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
                    onClick={handleOpenChat}
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
                name={"university__id"}
                isClear={isClear}
                handleChangeFilter={handleChangeFilter}
                icon={
                  <Image
                    src={UniversityIcon}
                    alt="university"
                    className="image"
                  />
                }
              />

              <div className="my-[12px] range">
                <label>
                  Age
                </label>
                <div className="px-[12px] bg-[#222] py-[18px] rounded-[8px]">
                <InputRange
                  maxValue={40}
                  minValue={18}
                  value={ageV}
                  onChange={handleChangeAge}
                  
                />
                </div>
              </div>

              <SelectForm
                label={"Competition"}
                placeholder={"Competition"}
                options={competitionOptions}
                name={"competition__id"}
                handleChangeFilter={handleChangeFilter}
                isClear={isClear}
                icon={
                  <Image src={CupIcon} alt="competition" className="image" />
                }
              />
              <SelectForm
                label={"City"}
                placeholder={"City"}
                name={"city"}
                options={psOptions}
                handleChangeFilter={handleChangeFilter}
                isClear={isClear}
                icon={<Image src={PlaceIcon} alt="city" className="image" />}
              />
              <SelectForm
                label={"Team Member"}
                placeholder={"Team Member"}
                options={memberOptions}
                name={"team_member_count"}
                handleChangeFilter={handleChangeFilter}
                isClear={isClear}
                icon={
                  <Image src={UserIcon} alt="team_member" className="image" />
                }
              />
              <SelectForm
                label={"Domain"}
                placeholder={"Domain"}
                options={domainOptions}
                name={"domain__id"}
                isClear={isClear}
                handleChangeFilter={handleChangeFilter}
                icon={<Image src={DomainIcon} alt="domain" className="image" />}
              />
              <SelectForm
                label={"Skill set"}
                placeholder={"Skill set"}
                name={"skill_set"}
                options={s}
                isClear={isClear}
                handleChangeFilter={handleChangeFilter}
                icon={<Image src={SkillIcon} alt="skill" className="image" />}
              />
              <div
                className="mt-[12px] text-[14px] lh-1 bg-[#222] rounded-[4px] p-[4px] text-white w-[90px] cursor-pointer flex items-center justify-center"
                onClick={handleClear}
              >
                Clear all
              </div>
            </div>
            <div className="sidebar-footer">
              <div className="flex items-center gap-[12px]">  
              {userInfo?.avatar ? (
                <div className="avatar-image">
                  <Image
                    src={userInfo?.avatar?.file}
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
                  {userInfo?.first_name?.length > 15
                    ? userInfo?.first_name?.slice(0, 15) + "..."
                    : userInfo?.first_name}{" "}
                  {userInfo?.last_name}
                </span>
                <span className="setting" onClick={toggleOpenModalSetting}>
                  <div className="settings-container">
                    <Image src={Settings} alt="settings" className="image" />
                  </div>
                  Profile Setting
                </span>
              </div>
              </div>
              <div onClick={handleSignout} className="signout">
                <Image src={SignoutIcon} alt="signout" className="image" />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Sidebar;
