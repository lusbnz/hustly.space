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
import { p } from "@/data/data";
import { deleteThread, updateThread } from "@/api/thread";

const ChatDetail = ({
  chatId,
  handleOpenDetail,
  tab,
  setChatId,
  isChangeChat,
}) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const recipientData = JSON.parse(localStorage.getItem("recipientData"));

  const contentRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isFetched, setIsFetched] = useState(false);

  const psOptions = p?.map((item) => {
    return {
      value: item.code,
      label: item.name,
    };
  });

  const fetchMessage = () => {
    getMessage(userData.id, chatId)
      .then((res) => {
        setMessages(res.reverse());
        setIsLoading(false);
        setIsFetched(true);
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        setIsFirstRender(false);
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
    }
  }, [chatId]);

  useEffect(() => {
    setIsFirstRender(true);
    setIsLoading(true);
  }, [isChangeChat]);

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

  const handlePin = () => {
    const data = {
      is_pin: true,
    };
    updateThread(userData.id, chatId, data);
  };

  const handleDelete = () => {
    deleteThread(userData.id, chatId);
    handleOpenDetail(null);
    setChatId(null);
  };

  const handleAccept = () => {
    const data = {
      is_matched: true,
    };
    updateThread(userData.id, chatId, data);
  };

  return (
    <div className="cd-wrapper">
      {isFirstRender && isLoading && !!chatId ? (
        <div className="w-100 h-[80vh] flex items-center justify-center">
          <BeatLoader color="#ffffff" size={16} />
        </div>
      ) : !!chatId && !isLoading ? (
        <>
          <div className="cd-header">
            <div className="flex items-center gap-[12px]">
              <div className="chat-avatar">
                {recipientData?.avatar?.file && (
                  <Image
                    src={recipientData?.avatar?.file}
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
              <div className="chat-infomation">
                <span className="chat-name">{recipientData?.first_name} {recipientData?.last_name}</span>
                <span className="chat-location">
                  {
                    psOptions?.find(
                      (e) => String(e.value) === String(recipientData?.city)
                    )?.label
                  }
                </span>
              </div>
            </div>
            <div className="cd-action">
              <div className="cd-icon" onClick={handlePin}>
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
                    <div className="message-avatar">
                      {recipientData?.avatar?.file && (
                        <Image
                          src={recipientData?.avatar?.file}
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
                  ) : (
                    <></>
                  )}
                  <div
                    className={`message-content ${checkIsMe(message) && "own"}`}
                  >
                    <span className="message-infomation">
                      {!checkIsMe(message)
                        ? `${recipientData.first_name} ${recipientData.last_name} - ${moment(
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
                onClick={handleDelete}
              />
              <ButtonComponent
                type={"button"}
                title={"Accept"}
                onClick={handleAccept}
              />
            </div>
          ) : (
            // <CKEditorComponent onSend={handleEditorSend} />
            <TextEditor handleSend={handleSend} />
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ChatDetail;
