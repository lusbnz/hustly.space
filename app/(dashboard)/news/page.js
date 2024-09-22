"use client";

import React, { useEffect, useState } from "react";
import "./styles.css";
import Badge from "@/components/common/Badge";
import ModalDetail from "@/components/layout/ModalDetail";
import { getSuggestions } from "@/api/profile";
import UserIcon from "@/public/icons/user-icon.svg";
import BirthdayIcon from "@/public/icons/birthday-icon.svg";
import LocationIcon from "@/public/icons/location-icon.svg";
import Image from "next/image";

const News = () => {
  const userInfo = JSON.parse(localStorage.getItem("userData"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suggestionData, setSuggestionData] = useState([]);

  const handleDetailCard = (index) => {
    if (isModalOpen === index) {
      setIsModalOpen(false);
    } else {
      setIsModalOpen(index);
    }
  };

  const fetchSuggestion = () => {
    getSuggestions()
      .then((res) => {
        setSuggestionData(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchSuggestion();
  }, []);

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
                <div className="avatar"></div>
                <div className="flex flex-col info">
                  <span className="name">
                    {item.first_name} {item.last_name}
                  </span>
                  <div className="flex gap-[24px]">
                    <span className="location flex items-center gap-[4px]">
                      <Image
                        src={LocationIcon}
                        alt="location-icon"
                        width={16}
                        height={16}
                      />
                      {item.city || "Hanoi"}
                    </span>
                    <span className="location flex items-center gap-[4px]">
                      <Image
                        src={BirthdayIcon}
                        alt="birth-icon"
                        width={16}
                        height={16}
                      />
                      {item.age || "18"}
                    </span>
                    <span className="location flex items-center gap-[4px]">
                      <Image
                        src={UserIcon}
                        alt="mem-icon"
                        width={16}
                        height={16}
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
                    return (
                      <Badge
                        backgroundColor={"#DAF4E0"}
                        color={"#009723"}
                        name={item.name}
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
