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

const ModalDetail = ({ isOpen }) => {
  const userInfomation = JSON.parse(localStorage.getItem("userData"));
  const router = useRouter();
  const pathname = usePathname();
  const [userInfo, setUserInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserInfo = () => {
    setIsLoading(true);
    getUser(isOpen)
      .then((res) => {
        setUserInfo(res);
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
      fetchUserInfo();
    }
  }, [isOpen]);
  const handleOpenChat = () => {
    const data = {
      to_user_id: isOpen,
    };
    createThread(userInfomation.id, data)
      .then((res) => {
        router.push(`/chats?recipientId=${isOpen}`);
      })
      .catch((err) => {
        console.log(err);
        router.push(`/chats?recipientId=${isOpen}`);
      });
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
              <div className="avatar"></div>
              <div className="flex flex-col justify-center info">
                <span className="name" style={{ color: "#FFFFFF" }}>
                  {userInfo?.first_name} {userInfo?.last_name}
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
                    {userInfo.city || "Hanoi"}
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
                    <span className="value">FPT University</span>
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <span className="key">Competition</span>
                    <span className="value">2021</span>
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <span className="key">Team member</span>
                    <span className="value">04</span>
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <span className="key">Field - experience</span>
                    <span className="value">BA Intern - 1 year</span>
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <span className="key">SKILL SET</span>
                    <span className="value">Presentation Skills</span>
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
