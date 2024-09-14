"use client";

import React, { useEffect, useRef } from "react";
import "./chats.css";
import Pin from "@/public/icons/pin-icon.svg";
import Dots from "@/public/icons/dots-icon.svg";
import Image from "next/image";

const ChatDetail = ({ chatId }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, []);

  return (
    <div className="cd-wrapper">
      <div className="cd-header">
        <div className="flex items-center gap-[12px]">
          <div className="chat-avatar"></div>
          <div className="chat-infomation">
            <span className="chat-name">Daniel Simon {chatId}</span>
            <span className="chat-location">Hanoi, Vietnam</span>
          </div>
        </div>
        <div className="cd-action">
          <div className="cd-icon">
            <Image src={Pin} alt="pin" className="image" />
          </div>
          <div className="cd-icon">
            <Image src={Dots} alt="dots" className="image" />
          </div>
        </div>
      </div>
      <div className="cd-content">
        {Array.from({ length: 50 }).map((_, index) => (
          <div
            key={index}
            className={`message ${index % 2 === 0 && "own"}`}
            ref={contentRef}
          >
            Message {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatDetail;
