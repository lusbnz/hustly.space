"use client";

import React, { use, useEffect, useRef, useState } from "react";
import "./chats.css";
import Pin from "@/public/icons/pin-icon.svg";
import Dots from "@/public/icons/dots-icon.svg";
import Image from "next/image";
import ButtonComponent from "../common/ButtonComponent";
import { getMessage, sendMessage } from "@/api/message";
import { BeatLoader } from "react-spinners";
import moment from "moment";
import TextEditor from "../common/TextEditor";

const ChatDetail = ({ chatId, handleOpenDetail, tab }) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const contentRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isFetched, setIsFetched] = useState(false);

  const fetchMessage = () => {
    setIsLoading(false);
    getMessage(userData.id, chatId)
      .then((res) => {
        setMessages(res.reverse());
        setIsLoading(false);
        setIsFetched(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (isFirstRender && chatId) {
      fetchMessage();
      setIsFirstRender(false);
    }
  }, [chatId]);

  useEffect(() => {
    if (isFetched) {
      const intervalId = setInterval(() => {
        fetchMessage();
        setIsFetched(false);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isFetched]);

  const checkIsMe = (message) => {
    return message.sender === userData.id;
  };

  const handleSend = (content, image) => {
    const data = {
      content: content,
      media: [image],
    };
    sendMessage(userData.id, chatId, data)
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="cd-wrapper">
      {chatId && !isLoading ? (
        <>
          <div className="cd-header">
            <div className="flex items-center gap-[12px]">
              <div className="chat-avatar"></div>
              <div className="chat-infomation">
                <span className="chat-name">{chatId}</span>
                <span className="chat-location">Hanoi, Vietnam</span>
              </div>
            </div>
            <div className="cd-action">
              <div className="cd-icon">
                <Image src={Pin} alt="pin" className="image" />
              </div>
              <div className="cd-icon" onClick={handleOpenDetail}>
                <Image src={Dots} alt="dots" className="image" />
              </div>
            </div>
          </div>
          <div className="cd-content">
            {messages.map((message, index) => (
              <>
                {/* {index === 2 && <div className="separator-date">today</div>} */}

                <div
                  key={message._id}
                  className={`message ${checkIsMe(message) && "own"}`}
                  ref={contentRef}
                >
                  {!checkIsMe(message) ? (
                    <div className="message-avatar"></div>
                  ) : (
                    <></>
                  )}
                  <div
                    className={`message-content ${checkIsMe(message) && "own"}`}
                  >
                    <span className="message-infomation">
                      {!checkIsMe(message)
                        ? `${message.sender} - ${moment(
                            message.timestamp
                          ).format("HH:mm")}`
                        : `You - ${moment(message.timestamp).format("HH:mm")}`}
                    </span>
                    <div
                      className={`message-content ${
                        checkIsMe(message) && "own"
                      }`}
                    >
                      <div
                        dangerouslySetInnerHTML={{ __html: message.content }}
                      />
                      {message.media?.length > 0 && (
                        <Image
                          src={message.media[0]?.file}
                          alt="message-image"
                          width={300}
                          height={200}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
          {tab === "unread" ? (
            <div className="flex items-center gap-[6px] w-100 mt-[40px]">
              <ButtonComponent
                type={"button"}
                title={"Delete"}
                border
                backgroundColor={"transparent"}
                color={"#ffffff"}
              />
              <ButtonComponent type={"button"} title={"Accept"} />
            </div>
          ) : (
            // <CKEditorComponent onSend={handleEditorSend} />
            <TextEditor handleSend={handleSend} />
          )}
        </>
      ) : isLoading ? (
        <div className="w-100 h-[80vh] flex items-center justify-center">
          <BeatLoader color="#ffffff" size={16} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ChatDetail;
