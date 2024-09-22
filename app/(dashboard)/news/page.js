"use client";

import React, { use, useEffect, useState } from "react";
import "./styles.css";
import Badge from "@/components/common/Badge";
import ModalDetail from "@/components/layout/ModalDetail";
import UserIcon from "@/public/icons/user-icon.svg";
import BirthdayIcon from "@/public/icons/birthday-icon.svg";
import LocationIcon from "@/public/icons/location-icon.svg";
import Image from "next/image";

const News = () => {
  const userInfo = JSON.parse(localStorage.getItem("userData"));
  const domain = JSON.parse(localStorage.getItem("domain"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suggestionData, setSuggestionData] = useState([]);
  const data = JSON.parse(localStorage.getItem("suggestions"));

  useEffect(() => {
    if (data.data[0]?.id !== suggestionData[0]?.id) {
      setSuggestionData(data.data);
    }
  }, [data]);

  const handleDetailCard = (index) => {
    if (isModalOpen === index) {
      setIsModalOpen(false);
    } else {
      setIsModalOpen(index);
    }
  };

  return (
    <>
      <div className="news-wrapper">
        <div className="flex flex-col">
          <span className="greeting">Hello {userInfo?.first_name}!</span>
          <span className="description">Have you found a partner yet?</span>
        </div>
        <div className="card-wrapper grid grid-cols-1 md:grid-cols-2">
          {suggestionData?.map((item) => (
            <div
              className="card-item"
              key={item.id}
              onClick={() => handleDetailCard(item.id)}
            >
              <div className="card-header flex">
                <div className="avatar">
                  {item?.avatar?.file && (
                    <Image
                      src={item?.avatar?.file}
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
                <div className="flex flex-col info">
                  <span className="name flex items-center gap-[4px]">
                    {item.first_name} {item.last_name}
                    <div
                      className={`w-[12px] h-[12px] rounded-full bg-[${
                        item.color || "white"
                      }]`}
                    ></div>
                  </span>
                  <div className="flex gap-[24px]">
                    <span className="location flex items-center gap-[4px]">
                      <Image
                        src={LocationIcon}
                        alt="location-icon"
                        width={14}
                        height={14}
                      />
                      {item.city || "Hanoi"}
                    </span>
                    <span className="location flex items-center gap-[4px]">
                      <Image
                        src={BirthdayIcon}
                        alt="birth-icon"
                        width={14}
                        height={14}
                      />
                      {item.age || "18"}
                    </span>
                    <span className="location flex items-center gap-[4px]">
                      <Image
                        src={UserIcon}
                        alt="mem-icon"
                        width={14}
                        height={14}
                      />
                      {item.team_member_count}
                    </span>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <span className="description">{item.bio}</span>
                <div className="tags">
                  {item.domain?.map((item) => {
                    const pd = item.parent_domain;
                    let sd = item.id;

                    if (pd === null) {
                      sd = domain?.find(
                        (e) => e.id === item.id
                      )?.name;
                    } else {
                      sd = domain
                        ?.find((e) => e.id === item.parent_domain)
                        ?.sub_domains?.find((e) => e.id === item.id)?.name;
                    }

                    return (
                      <Badge
                      key={item.id}
                        backgroundColor={"#DAF4E0"}
                        color={"#009723"}
                        name={sd}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen !== false && <ModalDetail isOpen={isModalOpen} />}
    </>
  );
};

export default News;
