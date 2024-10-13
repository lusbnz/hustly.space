"use client";

import React, { useEffect, useState } from "react";
import "./layout.css";
import "./styles.css";
import InstagramIcon from "@/public/icons/instagram-icon.svg";
import FacebookIcon from "@/public/icons/facebook-icon.svg";
import LinkedInIcon from "@/public/icons/linkedin-icon.svg";
import Image from "next/image";
import ButtonComponent from "../common/ButtonComponent";
import { usePathname, useRouter } from "next/navigation";
import { getUser } from "@/api/profile";
import moment from "moment";
import { createThread } from "@/api/thread";
import UserIcon from "@/public/icons/user-icon.svg";
import BirthdayIcon from "@/public/icons/birthday-icon.svg";
import LocationIcon from "@/public/icons/location-icon.svg";
import { BeatLoader } from "react-spinners";
import { s } from "@/data/data";
import { useDispatch, useSelector } from "react-redux";
import ModalFirstChat from "./ModalFirstChat";
import { removeVietnameseTones } from "@/utils/utils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Badge from "../common/Badge";

const ModalDetail = ({ isOpen, setIsLoadingDetail, isChat, check }) => {
  const dispatch = useDispatch();
  const userInfomation = useSelector((state) => state.userInfo);
  const university = useSelector((state) => state.university);
  const competition = useSelector((state) => state.competition);
  const domain = useSelector((state) => state.domain);

  const router = useRouter();
  const pathname = usePathname();
  const [userInfo, setUserInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openFirstChat, setOpenFirstChat] = useState(false);
  const [threadId, setThreadId] = useState(null);

  const toggleFirstChat = () => {
    setOpenFirstChat(false);
  };

  const fetchUserInfo = () => {
    if (isChat) {
      setIsLoadingDetail(true);
    }
    setIsLoading(true);
    getUser(isOpen)
      .then((res) => {
        setUserInfo(res);
        localStorage.setItem("receive", JSON.stringify(res));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
        if (isChat) {
          setIsLoadingDetail(false);
        }
      });
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetchUserInfo();
    }
  }, [isOpen]);

  const handleOpenChat = () => {
    if (check === null) {
      setOpenFirstChat(true);
    } else {
      router.push(`/chats?recipientId=${isOpen}`);
    }
  };
  const isHideMessage = pathname === "/chats";

  const domainOptions = domain?.map((item) => {
    return {
      value: item.id,
      label: removeVietnameseTones(item.name),
      color: item.color,
      subOptions: item.sub_domains.map((item) => ({
        value: item.id,
        label: removeVietnameseTones(item.name),
        color: item.color,
      })),
    };
  });

  // domainOptions.unshift({
  //   value: null,
  //   label: "",
  // });

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

  const universityOptions = university?.map((item) => {
    return {
      value: String(item.id),
      label: removeVietnameseTones(item.name),
    };
  });

  const uni = universityOptions.find((item) => item.id === userInfo?.city);
  let com;

  if (userInfo?.competition?.length > 0) {
    com = competitionOptions.find(
      (item) => item.value === userInfo?.competition[0]?.id
    );
  }

  function findLabelById(id, parentDomain) {
    if (parentDomain === null) {
      const mainDomain = domainOptions.find((domain) => domain.value === id);
      return mainDomain ? mainDomain.label : "Not found";
    }

    const parent = domainOptions.find(
      (domain) => domain.value === parentDomain
    );
    if (!parent || !parent.subOptions) return "Not found";

    const subOption = parent.subOptions.find((sub) => sub.value === id);
    return subOption ? subOption.label : "Not found";
  }

  function hexToRgb(hex) {
    hex = hex.replace("#", "");
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return [r, g, b];
  }

  function rgbToHex(r, g, b) {
    return (
      "#" +
      ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
    );
  }

  function lightenColor(hex, factor = 0.5) {
    let [r, g, b] = hexToRgb(hex);
    r = Math.round(r + (255 - r) * factor);
    g = Math.round(g + (255 - g) * factor);
    b = Math.round(b + (255 - b) * factor);
    return rgbToHex(r, g, b);
  }

  function darkenColor(hex, factor = 0.5) {
    let [r, g, b] = hexToRgb(hex);
    r = Math.round(r * (1 - factor));
    g = Math.round(g * (1 - factor));
    b = Math.round(b * (1 - factor));
    return rgbToHex(r, g, b);
  }

  return (
    <>
      <div
        className={`flex w-100 justify-end flex-1 modal-detail ${
          isOpen ? "show" : ""
        }`}
      >
        <div className="sidebar-wrapper bg-[#171717] text-white rounded-[20px] max-h-[100vh] overflow-y-auto">
          {isLoading ? (
            <div className="w-100 h-[80vh] flex items-center justify-center">
              <BeatLoader color="#FFFFFF" size={10} />
            </div>
          ) : (
            <>
              <div className="card-header flex">
                <div className="avatar">
                  {userInfo?.avatar?.file && (
                    <Image
                      src={userInfo?.avatar?.file}
                      alt="avatar"
                      width={64}
                      height={64}
                      style={{
                        objectFit: "cover",
                        height: "100%",
                        width: "100%",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                </div>
                <div className="flex flex-col justify-center info">
                  <span className="name flex items-center gap-[4px]">
                    <span
                      className="lh-1 h-[12px] text-center"
                      style={{
                        fontSize:
                          "clamp(10px, calc((18 / 1920) * 100vw), 22px)",
                      }}
                    >
                      {userInfo?.first_name} {userInfo?.last_name}
                    </span>

                    <div
                      className={`rounded-full`}
                      style={{
                        backgroundColor: userInfo?.color || "#ffffff",
                        width: "calc(14 / 1920 * 100vw)",
                        height: "calc(14 / 1920 * 100vw)",
                      }}
                    ></div>
                  </span>
                  <div className="flex gap-[12px]">
                    <span className="location flex items-center gap-[4px]">
                      <Image
                        src={BirthdayIcon}
                        alt="location-icon"
                        width={14}
                        height={14}
                      />
                      {userInfo?.age || "18"}
                    </span>
                    <span className="location flex items-center gap-[4px]">
                      <Image
                        src={LocationIcon}
                        alt="location-icon"
                        width={14}
                        height={14}
                      />
                      {uni?.label || "Hanoi"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <span
                  className="description"
                  style={{ color: "rgba(255, 255, 255, 0.60)" }}
                >
                  {userInfo?.bio}
                </span>
                <div className="contact">
                  <span style={{ color: "#484848 !important" }}>CONTACT</span>
                  <div className="flex social items-center">
                    <div
                      className="social-icon"
                      onClick={() => {
                        if (!!userInfo?.social_link?.instagram) {
                          window.open(
                            userInfo?.social_link?.instagram,
                            "_blank"
                          );
                        }
                      }}
                    >
                      <Image src={InstagramIcon} alt="image" />
                    </div>
                    <div
                      className="social-icon"
                      onClick={() => {
                        if (!!userInfo?.social_link?.mail) {
                          window.open(userInfo?.social_link?.mail, "_blank");
                        }
                      }}
                    >
                      <Image src={FacebookIcon} alt="image" />
                    </div>
                    <div
                      className="social-icon"
                      onClick={() => {
                        if (!!userInfo?.social_link?.linkedin) {
                          window.open(
                            userInfo?.social_link?.linkedin,
                            "_blank"
                          );
                        }
                      }}
                    >
                      <Image src={LinkedInIcon} alt="image" />
                    </div>
                  </div>
                  <div className="flex w-100 gap-[6px] action-wrapper">
                    <ButtonComponent
                      type={"button"}
                      title={"Share"}
                      border
                      backgroundColor={"transparent"}
                      color={"#ffffff"}
                      onClick={() => {
                        const textToCopy = `${window.location.href}?rel=${isOpen}`;

                        navigator.clipboard
                          .writeText(textToCopy)
                          .then(() => {
                            console.log("Copied to clipboard successfully!");
                            toast.success("Copied to clipboard");
                          })
                          .catch((err) => {
                            console.error("Failed to copy: ", err);
                          });
                      }}
                    />
                    {!isHideMessage && (
                      <ButtonComponent
                        type={"button"}
                        title={"Message"}
                        onClick={handleOpenChat}
                      />
                    )}
                  </div>
                  <div className="infomation">
                    <div className="flex flex-col gap-[6px]">
                      <span className="key">UNIVERSITY</span>
                      <span className="value">{uni?.label || "Hanoi"}</span>
                    </div>
                    <div className="flex flex-col gap-[6px]">
                      <span className="key">COMPETITION</span>
                      {userInfo?.competition?.[0] && (
                        <span className="value">
                          {com.label}
                          {" - "}
                          {userInfo?.competition?.[0]?.year_competition}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-[6px]">
                      <span className="key">TEAM MEMBER</span>
                      <span className="value">
                        {userInfo?.team_member_count}
                      </span>
                    </div>
                    <div className="flex flex-col gap-[6px]">
                      <span className="key">SKILL SET</span>
                      <div>
                        {userInfo?.skill_set && (
                          <div className="skills flex flex-wrap gap-[6px]">
                            {userInfo.skill_set.map((skill) => (
                              <span
                                key={skill}
                                className="value py-[6px] px-[8px] rounded-[4px] bg-[#323232] text-[#a7a7a7] text-[14px] font-[500]"
                              >
                                {s?.find((item) => item.value === skill)?.label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-[6px]">
                      <span className="key">DOMAIN</span>
                      <div>
                        {userInfo?.domain?.length > 0 && (
                          <span className="flex flex-wrap gap-[6px]">
                            {/* Hiển thị domain chính */}
                            {userInfo.domain.map((domain) => {
                              const domainLabel = findLabelById(
                                domain.id,
                                null
                              );
                              const domainColor =
                                domainOptions.find((d) => d.value === domain.id)
                                  ?.color || "#fff";

                              return (
                                <div key={domain.id}>
                                  <div className="font-[500] text-white mb-1"
                                  style={{
                                    fontSize: "clamp(14px, (17px / 1024 * 100vh), 17px)",
                                  }}
                                  >
                                    {domainLabel}
                                  </div>{" "}
                                  {/* Hiển thị text của domain cha */}
                                  {/* Hiển thị sub-domains */}
                                  {domain.sub_domains?.length > 0 && (
                                    <span className="flex flex-wrap gap-[6px]">
                                      {domain.sub_domains.map((subId) => {
                                        const subLabel = findLabelById(
                                          subId,
                                          domain.id
                                        );
                                        const subColor =
                                          domainOptions
                                            .find((d) => d.value === domain.id)
                                            ?.subOptions?.find(
                                              (e) => e.value === subId
                                            )?.color || "#fff"; // Lấy màu của sub-domain

                                        return (
                                          <Badge
                                            key={subId}
                                            backgroundColor={lightenColor(
                                              subColor,
                                              0.5
                                            )}
                                            color={darkenColor(subColor, 0.3)}
                                            name={subLabel}
                                          />
                                        );
                                      })}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-[6px]">
                      <span className="key">ACHIEVEMENT</span>
                      <div>
                        {userInfo?.archivement?.length > 0 && (
                          <div className="flex flex-wrap gap-[6px]">
                            {userInfo?.archivement?.map((archivement) => {
                              if (!!archivement.description) {
                                return (
                                  <span
                                    key={archivement.id}
                                    className="value py-[6px] px-[8px] rounded-[4px] bg-[#323232] text-[#a7a7a7] text-[14px] font-[500]"
                                  >
                                    {archivement.description}
                                  </span>
                                );
                              } else {
                                return null;
                              }
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-100 border-t border-t-[#fff] mt-[6px]"></div>
                    <div className="flex flex-col gap-[6px] mb-10">
                      {userInfo?.bio_image?.length > 0 &&
                        userInfo.bio_image.map((image, index) => (
                          <Image
                            key={index}
                            src={image?.file}
                            alt={`image-${index}`}
                            width={200}
                            height={100}
                            style={{
                              objectFit: "cover",
                              width: "calc((375 / 1920) * 100vw)",
                              height: "calc((300 / 1920) * 100vw)",
                              borderRadius: "8px",
                            }}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {openFirstChat && (
        <ModalFirstChat
          isOpen={openFirstChat}
          userInfo={userInfo}
          toggleOpenModal={toggleFirstChat}
        />
      )}

      <ToastContainer />
    </>
  );
};

export default ModalDetail;
