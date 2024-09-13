import React from "react";
import "./layout.css";
import "./styles.css";
import InstagramIcon from "@/public/icons/instagram-icon.svg";
import FacebookIcon from "@/public/icons/facebook-icon.svg";
import LinkedInIcon from "@/public/icons/linkedin-icon.svg";
import Image from "next/image";
import ButtonComponent from "../common/ButtonComponent";
import { useRouter } from "next/navigation";

const ModalDetail = ({ isOpen }) => {
  const router = useRouter()
  const handleOpenChat = () => {
    router.push("/chats");
  };
  return (
    <div
      className={`flex w-100 justify-end flex-1 modal-detail ${
        isOpen + 1 ? "show" : ""
      }`}
    >
      <div className="sidebar-wrapper bg-black text-white rounded-[20px]">
        <div className="card-header flex">
          <div className="avatar"></div>
          <div className="flex flex-col justify-center info">
            <span className="name" style={{ color: "#FFFFFF" }}>
              Daniel Simon {isOpen + 1}
            </span>
            <span className="location">Hanoi</span>
          </div>
        </div>
        <div className="card-body">
          <span
            className="description"
            style={{ color: "rgba(255, 255, 255, 0.60)" }}
          >
            Are you a passionate Python developer eager to create meaningful
            products? Were looking for you to help us build a free online
            learning platform to provide education for underprivileged children.
            Join us in making a difference!
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
              <ButtonComponent type={"button"} title={"Share"} border />
              <ButtonComponent
                type={"button"}
                title={"Message"}
                backgroundColor={"#FFFFFF"}
                color={"#000000"}
                onClick={handleOpenChat}
              />
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
      </div>
    </div>
  );
};

export default ModalDetail;
