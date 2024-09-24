import Image from "next/image";
import React, { useEffect, useState } from "react";
import BirthdayIcon from "@/public/icons/birthday-icon.svg";
import LocationIcon from "@/public/icons/location-icon.svg";
import moment from "moment";
import "./layout.css";
import "./styles.css";
import { useSelector } from "react-redux";
import TextEditor from "../common/TextEditor";
import { BeatLoader } from "react-spinners";
import { sendMessage } from "@/api/message";

const ModalFirstChat = ({ isOpen, userInfo, toggleOpenModal, threadId }) => {
  const user = useSelector((state) => state.userInfo);
  const university = useSelector((state) => state.university);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const universityOptions = university?.map((item) => {
    return {
      value: String(item.id),
      label: item.name,
    };
  });

  const uni = universityOptions.find((item) => item.id === userInfo?.city);

  const handleSend = (content, image) => {
    setIsLoading(true);
    const data = {
      content: content,
    };
    if(image){
        data.media = [image]
    }
    sendMessage(user?.id, threadId, data)
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(true);
        toggleOpenModal();
      });
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black opacity-90 z-20 ${
          isOpen ? "show" : ""
        }`}
        onClick={() => {
          toggleOpenModal();
        }}
      />
      <div className="w-[100vw] h-[90vh] bg-transparent opacity-100 absolute z-30 p-[22px] flex items-center justify-center">
        <div className="w-[600px] h-[260px] max-h-[100vh] p-[28px] text-white bg-[#171717] rounded-[20px] relative z-50">
          {isLoading ? (
            <div className="flex items-center justify-center w-100 h-[2px]">
              <BeatLoader color="#FFFFFF" size={10} />
            </div>
          ) : (
            <>
              <div className="card-header flex mb-4">
              <span onClick={toggleOpenModal}>back</span>

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
                      {uni?.label || "Hanoi"}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <TextEditor handleSend={handleSend} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ModalFirstChat;
