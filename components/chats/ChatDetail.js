"use client";

import React, { use, useEffect, useRef, useState } from "react";
import "./chats.css";
import Pin from "@/public/icons/pin-icon.svg";
import Dots from "@/public/icons/dots-icon.svg";
import Trash from "@/public/icons/trash-icon.svg";
import Hide from "@/public/icons/hide-icon.svg";
import Image from "next/image";
import ButtonComponent from "../common/ButtonComponent";
import { getMessage } from "@/api/message";
import { BeatLoader } from "react-spinners";
import moment from "moment";
import TextEditor from "../common/TextEditor";
import { p } from "@/data/data";
import { deleteThread, updateThread } from "@/api/thread";
import { useSelector } from "react-redux";
import { removeVietnameseTones } from "@/utils/utils";
import AttachmentIcon from "@/public/icons/attachment.svg";
import { getAuthToken } from "@/libs/clients";
import useSocket from "@/hooks/useSocket";
import { debounce } from "lodash";
import DefaultAvatar from "@/public/images/user-default.jpg";
import ModalDeleteConfirm from "../layout/ModalDeleteConfirm";
import ModalRejectConfirm from "../layout/ModalRejectConfirm";

const ChatDetail = ({
  chatId,
  handleOpenDetail,
  tab,
  setChatId,
  isChangeChat,
  isLoading,
  setIsLoading,
  isMatch,
  setIsMatch,
  isPin,
  setIsPin,
  setIsActiveTab,
  lastSender,
  setIsModalOpen,
  setSideRender,
  setListThread,
  isDeleted,
}) => {
  const userInfo = useSelector((state) => state.userInfo.userInfo);
  // const recipientInfo = JSON.parse(localStorage.getItem("receive"));
  const recipientInfo = useSelector((state) => state.userInfo.receiveInfo);
  const isLoadingR = useSelector((state) => state.userInfo.isLoadingR);

  const contentRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [haveImage, setHaveImage] = useState(false);
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const profileId = userInfo?.id;
  const token = getAuthToken();

  const [wsUrl, setWsUrl] = useState(
    `wss://backend.hustlyspace.com/ws/${profileId}/thread/${chatId}/message/`
  );

  const [threadWsUrl, setThreadWsUrl] = useState(
    `wss://backend.hustlyspace.com/ws/${profileId}/thread/`
  );

  useEffect(() => {
    if (!!chatId && !!profileId) {
      setWsUrl(
        `wss://backend.hustlyspace.com/ws/${profileId}/thread/${chatId}/message/`
      );
    }
  }, [profileId, chatId]);

  const { response, sendMessage } = useSocket(wsUrl, token);
  const { deleteThreadWs } = useSocket(threadWsUrl, token);

  useEffect(() => {
    if (!response) return;
    setMessages(response?.reverse());

    setIsLoading(false);
    setIsFirstRender(false);
  }, [response]);

  const psOptions = p?.map((item) => {
    return {
      value: item.code,
      label: removeVietnameseTones(item.name),
    };
  });

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    setIsFirstRender(true);
  }, [isChangeChat]);

  const checkIsMe = (message) => {
    return message.sender !== recipientInfo?.id;
  };

  const handleSend = debounce((content, image) => {
    setIsLoadingMessage(true);
    console.log("content", content);
    const cleanContent = content.replace(/&nbsp;/g, "").trim();
    console.log("cleanContent", cleanContent);
    if (!cleanContent && !image) {
      console.log("113");
      setIsLoadingMessage(false);
      return;
    }
    console.log("03", cleanContent);
    const data = { content: cleanContent, media: image ? [image] : [] };
    sendMessage(data);
    setIsLoadingMessage(false);
  }, 100);

  const handlePin = () => {
    const data = {
      is_pin: !isPin,
    };
    updateThread(userInfo?.id, chatId, data)
      .then((res) => {
        setListThread((prev) => {
          const index = prev.findIndex(
            (item) => item.thread_id === res.thread_id
          );

          if (index !== -1) {
            const newList = [...prev];
            newList[index] = res;
            return newList;
          } else {
            return [res, ...prev];
          }
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsPin(!isPin);
      });
  };

  const handleDelete = () => {
    setIsDeleting(true);
  };

  const handleReject = () => {
    setIsRejecting(true);
  };

  const handleDeleteConfirm = () => {
    const data = { is_match: false, thread_id: chatId };
    deleteThreadWs(data);
  };

  const handleRejectConfirm = () => {
    deleteThread(userInfo?.id, chatId);
    setListThread((prev) => {
      return prev.filter((item) => item.thread_id !== chatId);
    });
    handleOpenDetail(null);
    setChatId(null);
    setIsModalOpen(false);
  };

  const handleAccept = () => {
    const data = {
      is_match: true,
    };
    updateThread(userInfo?.id, chatId, data)
      .then((res) => {
        setListThread((prev) => {
          const index = prev.findIndex(
            (item) => item.thread_id === res.thread_id
          );

          if (index !== -1) {
            const newList = [...prev];
            newList[index] = res;
            return newList;
          } else {
            return [res, ...prev];
          }
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsActiveTab("all");
        setIsMatch(true);
        // setChatId(null);
        // setIsModalOpen(false);
      });
  };

  return (
    <>
      <div className="cd-wrapper">
        {isFirstRender && isLoading && !!chatId && isLoadingR ? (
          <div className="w-100 h-[80vh] flex items-center justify-center">
            <BeatLoader color="#ffffff" size={10} />
          </div>
        ) : !!chatId && !isLoading && !isLoadingR ? (
          <>
            <div className="cd-header">
              <div className="flex items-center gap-[12px]">
                <div className="chat-avatar">
                  <Image
                    src={recipientInfo?.avatar?.file || DefaultAvatar}
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
              {isMatch && (
                <div className="cd-action">
                  <div className="cd-icon" onClick={handlePin}>
                    <Image src={Pin} alt="pin" className="image" />
                  </div>
                  <div className="cd-icon" onClick={handleDelete}>
                    <Image src={Hide} alt="trash" className="image" />
                  </div>
                </div>
              )}
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
                    key={`${message._id}-${index}`}
                    className={`message ${checkIsMe(message) && "own"}`}
                    ref={contentRef}
                  >
                    {!checkIsMe(message) ? (
                      <div className="message-avatar">
                        <Image
                          src={recipientInfo?.avatar?.file || DefaultAvatar}
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
                      </div>
                    ) : (
                      <></>
                    )}
                    <div
                      className={`message-content ${
                        checkIsMe(message) && "own"
                      }`}
                    >
                      <span className="message-infomation">
                        {!checkIsMe(message)
                          ? `${recipientInfo?.first_name} ${
                              recipientInfo?.last_name
                            } - ${moment(message.timestamp).format("HH:mm")}`
                          : `You - ${moment(message.timestamp).format(
                              "HH:mm"
                            )}`}
                      </span>
                      <div
                        className={`message-content ${
                          checkIsMe(message) && "own"
                        }`}
                      >
                        <div
                          style={{
                            width: "-webkit-fill-available",
                            wordWrap: "break-word",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                          }}
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
                                          ? message.media[0]?.name.slice(
                                              0,
                                              15
                                            ) + "..."
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
            ) : isDeleted === "deleted" ? (
              <div className="flex items-center gap-[6px] w-100 mt-[40px]">
                <ButtonComponent
                  type={"button"}
                  title={"Delete"}
                  border
                  backgroundColor={"transparent"}
                  color={"#ffffff"}
                  onClick={handleReject}
                />
                <ButtonComponent
                  type={"button"}
                  title={"Accept"}
                  onClick={handleAccept}
                />
              </div>
            ) : (messages?.length === 1 &&
                messages[0]?.sender !== recipientInfo?.id) ||
              isDeleted === "is_deleted" ? (
              <></>
            ) : (
              <div className="flex items-center gap-[6px] w-100 mt-[40px]">
                <ButtonComponent
                  type={"button"}
                  title={isDeleted !== null ? "Delete" : "Reject"}
                  border
                  backgroundColor={"transparent"}
                  color={"#ffffff"}
                  onClick={handleReject}
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
      {isDeleting && (
        <ModalDeleteConfirm
          isOpen={isDeleting}
          toggleOpenModal={() => {
            setIsDeleting(false);
          }}
          handleConfirm={handleDeleteConfirm}
        />
      )}
      {isRejecting && (
        <ModalRejectConfirm
          isOpen={isRejecting}
          toggleOpenModal={() => {
            setIsRejecting(false);
          }}
          handleConfirm={handleRejectConfirm}
          isTypeDelete={isDeleted === null ? false : true}
        />
      )}
    </>
  );
};

export default ChatDetail;
