"use client";

import React, { use, useEffect, useRef, useState } from "react";
import "./chats.css";
import Pin from "@/public/icons/pin-icon.svg";
import Dots from "@/public/icons/dots-icon.svg";
import Trash from "@/public/icons/trash-icon.svg";
import Image from "next/image";
import ButtonComponent from "../common/ButtonComponent";
import { getMessage, sendMessage } from "@/api/message";
import { BeatLoader } from "react-spinners";
import moment from "moment";
import TextEditor from "../common/TextEditor";
import { p } from "@/data/data";
import { deleteThread, updateThread } from "@/api/thread";
import { useSelector } from "react-redux";
import { removeVietnameseTones } from "@/utils/utils";
import AttachmentIcon from "@/public/icons/attachment.svg";

const ChatDetail = ({
  chatId,
  handleOpenDetail,
  tab,
  setChatId,
  isChangeChat,
  isLoading,
  setIsLoading,
  isMatch,
  isPin,
  setIsActiveTab,
  lastSender,
  setIsModalOpen,
  setSideRender,
}) => {
  const userInfo = useSelector((state) => state.userInfo);
  const recipientInfo = JSON.parse(localStorage.getItem("receive"));

  const contentRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isFetched, setIsFetched] = useState(false);
  const [haveImage, setHaveImage] = useState(false);
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);

  const psOptions = p?.map((item) => {
    return {
      value: item.code,
      label: removeVietnameseTones(item.name),
    };
  });

  const fetchMessage = () => {
    if (!!chatId) {
      getMessage(userInfo?.id, chatId)
        .then((res) => {
          setMessages(res.reverse());
          setIsFetched(true);
        })
        .catch((err) => {
          console.log(err);
        })
        .then(() => {
          setIsFirstRender(false);
          setIsLoading(false);
        });
    }
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
    // setIsLoading(true);
  }, [isChangeChat]);

  useEffect(() => {
    if (isFetched) {
      const intervalId = setInterval(() => {
        setIsFetched(false);
        fetchMessage();
      }, 100);
      return () => clearInterval(intervalId);
    }
  }, [isFetched]);

  const checkIsMe = (message) => {
    return message.sender === userInfo?.id;
  };

  const handleSend = (content, image) => {
    setIsLoadingMessage(true);
    if (content === "" && !image) {
      setIsLoadingMessage(false);
      return;
    }
    const data = {
      content: content,
      media: [image],
    };
    sendMessage(userInfo?.id, chatId, data)
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoadingMessage(false);
      });
  };

  const handlePin = () => {
    const data = {
      is_pin: !isPin,
    };
    updateThread(userInfo?.id, chatId, data);
  };

  const handleDelete = () => {
    setSideRender(true);
    deleteThread(userInfo?.id, chatId);
    handleOpenDetail(null);
    setChatId(null);
    setIsModalOpen(false);
  };

  const handleAccept = () => {
    const data = {
      is_match: true,
    };
    updateThread(userInfo?.id, chatId, data)
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsActiveTab("all");
        setChatId(null);
        setIsModalOpen(false);
      });
  };

  return (
    <div className="cd-wrapper">
      {isFirstRender && isLoading && !!chatId ? (
        <div className="w-100 h-[80vh] flex items-center justify-center">
          <BeatLoader color="#ffffff" size={10} />
        </div>
      ) : !!chatId && !isLoading ? (
        <>
          <div className="cd-header">
            <div className="flex items-center gap-[12px]">
              <div className="chat-avatar">
                {recipientInfo?.avatar?.file && (
                  <Image
                    src={recipientInfo?.avatar?.file}
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
                <span className="chat-name">
                  {recipientInfo?.first_name} {recipientInfo?.last_name}
                </span>
                <span className="chat-location">
                  {
                    psOptions?.find(
                      (e) => String(e.value) === String(recipientInfo?.city)
                    )?.label
                  }
                </span>
              </div>
            </div>
            <div className="cd-action">
              <div className="cd-icon" onClick={handlePin}>
                <Image src={Pin} alt="pin" className="image" />
              </div>
              <div className="cd-icon" onClick={handleDelete}>
                <Image src={Trash} alt="trash" className="image" />
              </div>
            </div>
          </div>
          <div
            className="cd-content"
            style={
              haveImage
                ? {
                    height: "55%",
                  }
                : {
                    height: "100%",
                  }
            }
          >
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
                      {recipientInfo?.avatar?.file && (
                        <Image
                          src={recipientInfo?.avatar?.file}
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
                        ? `${recipientInfo?.first_name} ${
                            recipientInfo?.last_name
                          } - ${moment(message.timestamp).format("HH:mm")}`
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
                        <>
                          {message.media[0]?.file && (
                            <div>
                              {/* Check if the media is an image or not */}
                              {message.media[0]?.file.endsWith(".jpg") ||
                              message.media[0]?.file.endsWith(".jpeg") ||
                              message.media[0]?.file.endsWith(".png") ? (
                                <Image
                                  src={message.media[0]?.file}
                                  alt="message-image"
                                  width={200}
                                  height={100}
                                />
                              ) : (
                                // Render non-image file with AttachmentIcon
                                <div className="file-preview flex items-center justify-center p-2 min-w-[100px] h-[32px] rounded-[4px] cursor-pointer">
                                  <a
                                    href={message.media[0]?.file} // URL of the file to download
                                    download={message.media[0]?.file} // Name of the file
                                    className="flex items-center"
                                    target="_blank"
                                  >
                                    <Image
                                      src={AttachmentIcon}
                                      alt="attachment icon"
                                      width={12}
                                      height={12}
                                    />
                                    <span className="ml-2">
                                      {message.media[0]?.name?.length > 15
                                        ? message.media[0]?.name.slice(0, 15) +
                                          "..."
                                        : message?.media[0]?.name}{" "}
                                      {/* Show file name */}
                                    </span>
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
          {isMatch ? (
            <TextEditor
              handleSend={handleSend}
              isDetail={true}
              setHaveImage={(e) => setHaveImage(e)}
              isLoading={isLoadingMessage}
              setIsLoading={(e) => setIsLoadingMessage(e)}
            />
          ) : messages?.length === 1 && messages[0]?.sender === userInfo?.id ? (
            <></>
          ) : (
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
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ChatDetail;
