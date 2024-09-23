"use client";

import React, { useEffect, useState } from "react";
import "./styles.css";
import { useRouter } from "next/navigation";
import ChatDetail from "@/components/chats/ChatDetail";
import ModalDetail from "@/components/layout/ModalDetail";
import { getThread } from "@/api/thread";
import BackIcon from "@/public/icons/back-icon.svg";
import moment from "moment";
import BeatLoader from "react-spinners/BeatLoader";
import Image from "next/image";
import PinIcon from "@/public/icons/pin-icon.svg";
import { useSelector } from "react-redux";

const Chats = () => {
  const userInfo = useSelector((state) => state.userInfo);

  const router = useRouter();
  const [isActiveTab, setIsActiveTab] = useState("all");
  const [isActiveChat, setIsActiveChat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listThread, setListThread] = useState([]);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isFetched, setIsFetched] = useState(false);
  const [isChangeChat, setIsChangeChat] = useState(false);

  const fetchThread = () => {
    getThread(userInfo?.id)
      .then((res) => {
        setListThread(res);
        setIsFetched(true);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsFirstRender(false);
      });
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const chatId = searchParams.get("chatId");

    if (chatId) {
      setIsActiveChat(chatId);
    }

    if (isFirstRender) {
      fetchThread();
    }
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const recipientId = searchParams.get("recipientId");

    if (recipientId && listThread.length > 0) {
      const thread = listThread.find(
        (item) => item.recipient.id === recipientId
      );
      if (thread) {
        setIsActiveChat(thread.thread_id);
        setIsModalOpen(recipientId);
      }
    }
  }, [listThread]);

  useEffect(() => {
    if (isFetched) {
      const intervalId = setInterval(() => {
        fetchThread();
        setIsFetched(false);
      }, 4000);
      return () => clearInterval(intervalId);
    }
  }, [isFetched]);

  const handleSelectTab = (tab) => {
    setIsActiveTab(tab);
    setIsActiveChat(null);
    setIsModalOpen(false);
    if (tab === "all") {
      router.replace(`/chats`, undefined, { shallow: true });
    } else {
      router.replace(`/chats?tab=${tab}`, undefined, { shallow: true });
    }
  };

  const handleOpenChatDetail = (thread_id, recipient_id) => {
    setIsActiveChat(thread_id);
    setIsModalOpen(recipient_id);
    setIsChangeChat(thread_id);

    router.replace(`/chats?chatId=${thread_id}`, undefined, { shallow: true });
  };

  const handleOpenDetail = () => {
    setIsModalOpen(isActiveChat);
  };

  const handleCloseChat = () => {
    router.replace(`/news`, undefined, { shallow: true });
  };

  return (
    <div className="cw flex">
      {isFirstRender ? (
        <div className="w-[100vw] h-[80vh] flex items-center justify-center">
          <BeatLoader color="#fff" size={10} />
        </div>
      ) : (
        <>
          <div className="chat-wrapper flex flex-col">
            <div className="tab">
              <>
                <div
                  className="text-white cursor-pointer flex items-center gap-[6px]"
                  onClick={handleCloseChat}
                >
                  <Image src={BackIcon} alt="send" width={20} height={20} />
                  <h1>Chats</h1>
                </div>
                <div className="tab-list flex gap-[6px] w-100 justify-between">
                  <div
                    className={`tab-item flex items-center justify-center ${
                      isActiveTab === "all"
                        ? "bg-[#ffffff] text-[#343434]"
                        : "text-[#ffffff]"
                    }`}
                    onClick={() => handleSelectTab("all")}
                  >
                    All
                  </div>
                  <div
                    className={`tab-item flex items-center justify-center ${
                      isActiveTab === "pinned"
                        ? "bg-[#ffffff] text-[#343434]"
                        : "text-[#ffffff]"
                    }`}
                    onClick={() => handleSelectTab("pinned")}
                  >
                    Pinned
                  </div>
                  <div
                    className={`tab-item flex items-center justify-center ${
                      isActiveTab === "unread"
                        ? "bg-[#ffffff] text-[#343434]"
                        : "text-[#ffffff]"
                    }`}
                    onClick={() => handleSelectTab("unread")}
                  >
                    Unread
                  </div>
                </div>
              </>
            </div>
            <div className="chat-detail">
              {listThread
                ?.filter((thread) => {
                  if (isActiveTab === "pinned") {
                    return thread.is_pin === true;
                  }
                  if (isActiveTab === "unread") {
                    return thread.is_match === false;
                  }
                  return true;
                })
                ?.sort((a, b) => {
                  if (!a.is_pin && !a.is_match && !b.is_pin && !b.is_match) {
                    return new Date(b.updated_at) - new Date(a.updated_at);
                  }
                  return 0;
                })
                ?.map((thread) => {
                  const sanitizedContent =
                    thread?.last_message?.content.replace(/<br\s*\/?>/gi, "");
                  return (
                    <div
                      className={`chat-item ${
                        isActiveChat === thread.recipient.id && "bg-[#222]"
                      }`}
                      key={thread.recipient.id}
                      onClick={() =>
                        handleOpenChatDetail(
                          thread.thread_id,
                          thread.recipient.id
                        )
                      }
                    >
                      <div className="flex items-center gap-[6px]">
                        <div className="chat-avatar">
                          {thread?.recipient?.avatar?.file && (
                            <Image
                              src={thread?.recipient?.avatar?.file}
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
                          <span className="chat-name flex items-center">
                            {thread?.recipient?.name}
                            {thread.is_pin && (
                              <div className="chat-pin">
                                <Image
                                  src={PinIcon}
                                  alt="pin"
                                  width={12}
                                  height={12}
                                  className="ml-1"
                                />
                              </div>
                            )}
                          </span>
                          <span
                            className="last-message"
                            style={
                              thread?.unread_count > 0 &&
                              thread.last_message.sender !== userInfo?.id
                                ? { color: "rgba(255, 255, 255, 1)" }
                                : { color: "rgba(255, 255, 255, 0.40)" }
                            }
                          >
                            {sanitizedContent?.length > 15 ? (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: `${sanitizedContent.slice(0, 15)}...`,
                                }}
                              />
                            ) : (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: sanitizedContent,
                                }}
                              />
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="chat-advance">
                        <div className="chat-time text-white">
                          {moment(thread.updated_at).format("HH:mm")}
                        </div>
                        {thread?.unread_count > 0 &&
                          thread.last_message.sender !== userInfo?.id && (
                            <div className="notification">
                              {thread?.unread_count}
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="chat-container">
            <ChatDetail
              chatId={isActiveChat}
              setChatId={setIsActiveChat}
              handleOpenDetail={handleOpenDetail}
              tab={isActiveTab}
              isChangeChat={isChangeChat}
            />
          </div>
          {isModalOpen && <ModalDetail isOpen={isModalOpen} />}
        </>
      )}
    </div>
  );
};

export default Chats;
