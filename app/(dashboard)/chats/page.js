"use client";

import React, { useState } from "react";
import "./styles.css";
import { useRouter } from "next/navigation";
import ChatDetail from "@/components/chats/ChatDetail";

const Chats = () => {
  const router = useRouter();
  const [isActiveTab, setIsActiveTab] = useState("all");
  const [isActiveChat, setIsActiveChat] = useState(null);

  const handleSelectTab = (tab) => {
    setIsActiveTab(tab);
    if (tab === "all") {
      router.replace(`/chats`, undefined, { shallow: true });
    } else {
      router.replace(`/chats?tab=${tab}`, undefined, { shallow: true });
    }
  };

  const handleOpenChatDetail = (id) => {
    setIsActiveChat(id);
    router.replace(`/chats?chatId=${id}`, undefined, { shallow: true });
  };

  const lastMessage = "Hahaha, sure brooo!";

  return (
    <div className="cw flex">
      <div className="chat-wrapper flex flex-col">
        <div className="tab">
          <h1>Chats</h1>
          <div className="tab-list flex gap-[6px] w-100 justify-between">
            <div
              className={`tab-item flex items-center justify-center ${
                isActiveTab === "all" && "bg-[#000000] text-[#FFFFFF]"
              }`}
              onClick={() => handleSelectTab("all")}
            >
              All
            </div>
            <div
              className={`tab-item flex items-center justify-center ${
                isActiveTab === "pinned" && "bg-[#000000] text-[#FFFFFF]"
              }`}
              onClick={() => handleSelectTab("pinned")}
            >
              Pinned
            </div>
            <div
              className={`tab-item flex items-center justify-center ${
                isActiveTab === "unread" && "bg-[#000000] text-[#FFFFFF]"
              }`}
              onClick={() => handleSelectTab("unread")}
            >
              Unread
            </div>
          </div>
        </div>
        <div className="chat-detail">
          {Array(1, 2, 3, 4, 5, 6, 7, 8).map((item, index) => (
            <div
              className={`chat-item ${
                isActiveChat === index + 1 && "bg-[#ffffff]"
              }`}
              key={index}
              onClick={() => handleOpenChatDetail(index + 1)}
            >
              <div className="chat-avatar"></div>
              <div className="chat-infomation">
                <span className="chat-name">Daniel Simon {index + 1}</span>
                <span className="last-message">
                  {lastMessage.length > 10
                    ? `${lastMessage.slice(0, 10)}...`
                    : lastMessage}
                </span>
              </div>
              <div className="chat-advance">
                <div className="time">14:00</div>
                <div className="notification">2</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-container">
        <ChatDetail chatId={isActiveChat} />
      </div>
    </div>
  );
};

export default Chats;