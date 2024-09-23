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

const ModalDetail = ({ isOpen }) => {
  const dispatch = useDispatch();
  const userInfomation = useSelector((state) => state.userInfo);
  const university = useSelector((state) => state.university);
  const competition = useSelector((state) => state.competition);
  const domain = useSelector((state) => state.domain);

  const router = useRouter();
  const pathname = usePathname();
  const [userInfo, setUserInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserInfo = () => {
    setIsLoading(true);
    getUser(isOpen)
      .then((res) => {
        setUserInfo(res);
        localStorage.setItem("receive", JSON.stringify(res))
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetchUserInfo();
    }
  }, [isOpen]);

  const handleOpenChat = () => {
    router.push(`/chats?recipientId=${isOpen}`);

    const data = {
      to_user_id: isOpen,
    };
    createThread(userInfomation.id, data);
  };
  const isHideMessage = pathname === "/chats";

  return (
    <div
      className={`flex w-100 justify-end flex-1 modal-detail ${
        isOpen ? "show" : ""
      }`}
    >
      <div className="sidebar-wrapper bg-[#171717] text-white rounded-[20px]">
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
                <span className="name flex items-end gap-[4px]">
                  <span className="lh-1 h-[12px] text-[14px] text-center">
                    {userInfo?.first_name} {userInfo?.last_name}
                  </span>

                  <div
                    className={`w-[10px] h-[10px] rounded-full`}
                    style={{ backgroundColor: userInfo?.color || "#ffffff" }}
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
                    {moment(userInfo?.updated_at).format("HH:mm")}
                  </span>
                  <span className="location flex items-center gap-[4px]">
                    <Image
                      src={LocationIcon}
                      alt="location-icon"
                      width={14}
                      height={14}
                    />
                    {userInfo?.city || "Hanoi"}
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
                <div className="contact-wrapper">
                  <span>CONTACT</span>
                  <div className="flex social items-center">
                    <div className="social-icon">
                      <Image src={InstagramIcon} alt="image" />
                    </div>
                    <div className="social-icon">
                      <Image src={FacebookIcon} alt="image" />
                    </div>
                    <div className="social-icon">
                      <Image src={LinkedInIcon} alt="image" />
                    </div>
                  </div>
                </div>
                <div className="flex w-100 gap-[6px] action-wrapper">
                  <ButtonComponent
                    type={"button"}
                    title={"Share"}
                    border
                    backgroundColor={"transparent"}
                    color={"#ffffff"}
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
                    <span className="value">
                      {
                        university.find(
                          (item) => item.id === userInfo?.university
                        )?.name
                      }
                    </span>
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <span className="key">Competition</span>
                    <span className="value">
                      {userInfo?.competition?.[0]?.year_competition}
                    </span>
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <span className="key">Team member</span>
                    <span className="value">{userInfo?.team_member_count}</span>
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <span className="key">Field - experience</span>
                    <span className="value">BA Intern - 1 year</span>
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <span className="key">SKILL SET</span>
                    <span className="value">Presentation Skills</span>
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    {userInfo?.bio_image?.[0]?.file && (
                      <Image
                        src={userInfo?.bio_image?.[0]?.file}
                        alt="icon"
                        width={200}
                        height={100}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100px",
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalDetail;
