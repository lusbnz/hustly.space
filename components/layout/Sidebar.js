"use client";

import React, { useEffect, useState } from "react";
import "./layout.css";
import Logo from "@/public/images/logo.svg";
import Image from "next/image";
import Search from "@/public/icons/search-icon.svg";
import UserIcon from "@/public/icons/user-icon.svg";
import UniversityIcon from "@/public/icons/university-icon.svg";
import CupIcon from "@/public/icons/cup-icon.svg";
import YearIcon from "@/public/icons/year-icon.svg";
import DomainIcon from "@/public/icons/domain-icon.svg";
import SkillIcon from "@/public/icons/skill-icon.svg";
import PlaceIcon from "@/public/icons/place-icon.svg";
import SignoutIcon from "@/public/icons/sign-out.svg";
import Settings from "@/public/icons/settings-icon.svg";
import { usePathname, useRouter } from "next/navigation";
import SelectForm from "../common/SelectForm";
import { genderChoices, memberOptions, p, s, yearOptions } from "@/data/data";
import { useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { Range } from "react-range";
import { removeVietnameseTones } from "@/utils/utils";
import { checkUnread } from "@/api/profile";

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
  const [isFetchUnread, setIsFetchUnread] = useState(false);
  const [isUnread, setIsUnread] = useState(false);

  // const profileId = userInfo?.id;
  // const token = getAuthToken();

  // const [wsUrl, setWsUrl] = useState(
  //   `wss://backend.hustlyspace.com/ws/${profileId}/thread/`
  // );

  // useEffect(() => {
  //   setWsUrl(
  //     `wss://backend.hustlyspace.com/ws/${profileId}/thread/`
  //   );
  // }, [profileId]);

  // const { response } = useSocket(wsUrl, token);

  const unreadCheck = () => {
    checkUnread()
      .then((res) => {
        setIsUnread(res.remain_unread);
        setIsFetchUnread(true);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsFetchUnread(false);
      });
  };

  // useEffect(() => {
  //   if (!isFetchUnread) {
  //     const intervalId = setInterval(() => {
  //       unreadCheck();
  //     }, 4000);
  //     return () => clearInterval(intervalId);
  //   }
  // }, [isFetchUnread]);

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
      }
    }
  };

  const universityOptions = university?.map((item) => {
    return {
      value: item.id,
      label: removeVietnameseTones(item.name),
    };
  });

  const handleChangeFilter = (name, value) => {
    setIsClear(false);
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = (name) => {
    setFilter((prev) => {
      const newFilter = { ...prev };
      delete newFilter[name];
      return newFilter;
    });
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
      competition__year: "",
      gender: "",
    }));
    setIsClear(true);
  };

  const psOptions = p?.map((item) => {
    return {
      value: item.code,
      label: removeVietnameseTones(item.name),
    };
  });

  const competitionOptions = competition?.map((item) => {
    return {
      value: item.id,
      label: removeVietnameseTones(item.name),
    };
  });

  // competitionOptions.unshift({
  //   value: null,
  //   label: "",
  // });

  const domainOptions = domain?.map((item) => {
    return {
      value: item.id,
      label: removeVietnameseTones(item.name),
      color: item.color,
      subOptions: item.sub_domains.map((item) => ({
        value: item.id,
        label: removeVietnameseTones(item.name),
      })),
    };
  });

  // domainOptions.unshift({
  //   value: null,
  //   label: "",
  // });

  const handleSignout = () => {
    window.localStorage.removeItem("accessToken");
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
                <div
                  className="search-container relative"
                  onClick={handleOpenChat}
                >
                  <Image
                    src={Search}
                    alt="search"
                    className="image"
                    style={{ objectFit: "contain" }}
                    onClick={handleOpenChat}
                  />
                  {isUnread && (
                    <div className="w-[10px] h-[10px] bg-red-500 rounded-full absolute top-[-2px] right-[-2px]"></div>
                  )}
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
            <div className="sidebar-content pb-[100px] z-[2]">
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
                clearBtn={true}
                handleDelete={handleDelete}
              />

              <div className="my-[12px] range">
                <label>Age</label>
                <div
                  className="p-[12px] bg-[#171717] rounded-[8px] relative flex overflow-hidden items-center gap-[8px]"
                  style={{ border: "1px solid #2e2e2e" }}
                >
                  <div className="h-[16px] w-[16px] ml-2 mr-1">
                    <Image src={UserIcon} alt="age" className="image" />
                  </div>
                  <Range
                    step={1}
                    min={18}
                    max={40}
                    values={[ageV.min, ageV.max]}
                    onChange={(values) =>
                      setAgeV({ min: values[0], max: values[1] })
                    }
                    renderTrack={({ props, children }) => {
                      const trackStyle = {
                        height: "4px",
                        width: "calc((180 / 1920) * 100vw)",
                        background: "#222",
                        borderRadius: "2px",
                        position: "relative",
                      };

                      const left = ((ageV.min - 18) / (40 - 18)) * 100; // Tính toán phần trăm cho giá trị min
                      const right = 100 - ((ageV.max - 18) / (40 - 18)) * 100; // Tính toán phần trăm cho giá trị max

                      return (
                        <div {...props} style={trackStyle}>
                          <div
                            style={{
                              position: "absolute",
                              height: "4px",
                              left: `${left}%`,
                              right: `${right}%`,
                              background: "#ccc", // Màu của phần đã chọn
                              borderRadius: "2px",
                            }}
                          />
                          {children}
                        </div>
                      );
                    }}
                    renderThumb={({ props }) => (
                      <div
                        {...props}
                        style={{
                          height: "12px",
                          width: "12px",
                          backgroundColor: "#FFF",
                          border: "1px solid black",
                          borderRadius: "50%",
                          position: "absolute",
                        }}
                      />
                    )}
                  />
                  <div
                    className="text-white hidden lg:flex"
                    style={{
                      fontSize: "clamp(8px, 10px, 12px)",
                    }}
                  >
                    {ageV.min} - {ageV.max}
                  </div>
                </div>
              </div>

              <SelectForm
                label={"Gender"}
                placeholder={"Gender"}
                name={"gender"}
                options={genderChoices}
                handleChangeFilter={handleChangeFilter}
                isClear={isClear}
                icon={<Image src={UserIcon} alt="gender" className="image" />}
                clearBtn={true}
                handleDelete={handleDelete}
              />

              <div className="flex w-100 items-center gap-[6px] bg-[#171717]">
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
                  clearBtn={true}
                  handleDelete={handleDelete}
                />

                <SelectForm
                  label={"Year"}
                  placeholder={"Year"}
                  options={yearOptions}
                  name={"competition__year"}
                  handleChangeFilter={handleChangeFilter}
                  isClear={isClear}
                  icon={
                    <Image
                      src={YearIcon}
                      alt="competition_year"
                      className="image"
                    />
                  }
                  clearBtn={true}
                  handleDelete={handleDelete}
                />
              </div>
              <SelectForm
                label={"City"}
                placeholder={"City"}
                name={"city"}
                options={psOptions}
                handleChangeFilter={handleChangeFilter}
                isClear={isClear}
                icon={<Image src={PlaceIcon} alt="city" className="image" />}
                clearBtn={true}
                handleDelete={handleDelete}
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
                clearBtn={true}
                handleDelete={handleDelete}
              />
              <SelectForm
                label={"Domain"}
                placeholder={"Domain"}
                options={domainOptions}
                name={"domain__id"}
                isClear={isClear}
                // isMulti={true}
                handleChangeFilter={handleChangeFilter}
                icon={<Image src={DomainIcon} alt="domain" className="image" />}
                // defaultValue={filter.domain__id}
                clearBtn={true}
                handleDelete={handleDelete}
                isSidebar={true}
              />
              <SelectForm
                label={"Skill set"}
                placeholder={"Skill set"}
                name={"skill_set"}
                options={s}
                isClear={isClear}
                handleChangeFilter={handleChangeFilter}
                icon={<Image src={SkillIcon} alt="skill" className="image" />}
                isMulti={true}
                defaultValue={filter.skill_set}
              />
              <div
                className="mt-[12px] text-[14px] lh-1 bg-[#222] rounded-[4px] p-[4px] text-white w-[90px] cursor-pointer flex items-center justify-center"
                onClick={handleClear}
              >
                Clear all
              </div>
            </div>
            <div className="sidebar-footer pt-2 z-[1]">
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
                  <span
                    className="setting items-center flex"
                    onClick={toggleOpenModalSetting}
                  >
                    <div className="settings-container">
                      <Image src={Settings} alt="settings" className="image" />
                    </div>
                    <span className="ml-1">Profile Setting</span>
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
