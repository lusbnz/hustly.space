"use client";

import React, { useEffect, useState } from "react";
import "./styles.css";
import { useRouter } from "next/navigation";
import ChatDetail from "@/components/chats/ChatDetail";
import ModalDetail from "@/components/layout/ModalDetail";
import BackIcon from "@/public/icons/back-icon.svg";
import moment from "moment";
import BeatLoader from "react-spinners/BeatLoader";
import Image from "next/image";
import PinIcon from "@/public/icons/pin-icon.svg";
import { useSelector } from "react-redux";
import { getAuthToken } from "@/libs/clients";
import useSocket from "@/hooks/useSocket";
import DefaultAvatar from "@/public/images/user-default.jpg";

const Chats = () => {
  const userInfo = useSelector((state) => state.userInfo.userInfo);

  const router = useRouter();
  const [isActiveTab, setIsActiveTab] = useState("all");
  const [isActiveChat, setIsActiveChat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listThread, setListThread] = useState([]);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isSideRender, setIsSideRender] = useState(true);
  const [isChangeChat, setIsChangeChat] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(true);
  const [isMatch, setIsMatch] = useState(false);
  const [isPin, setIsPin] = useState(false);
  const [isDeleted, setIsDeleted] = useState(null);
  const [lastSender, setLastSender] = useState(null);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  const profileId = userInfo?.id;
  const token = getAuthToken();

  const [wsUrl, setWsUrl] = useState(
    `wss://backend.hustlyspace.com/ws/${profileId}/thread/`
  );

  useEffect(() => {
    if (!!profileId) {
      setWsUrl(`wss://backend.hustlyspace.com/ws/${profileId}/thread/`);
    }
  }, [isFirstRender, isSideRender, profileId]);

  const { response } = useSocket(wsUrl, token);

  useEffect(() => {
    if (!!response) {
      if (response?.length > 0) {
        setListThread((prev) => {
          const uniqueResponse = response.filter(
            (newItem) =>
              !prev.some((item) => item.thread_id === newItem.thread_id)
          );
          return [...uniqueResponse, ...prev];
        });
      } else {
        setListThread((prev) => {
          const index = prev.findIndex(
            (item) => item.thread_id === response.thread_id
          );

          if (index !== -1) {
            const newList = [...prev];

            newList[index] = response;
            return newList;
          } else {
            return [response, ...prev];
          }
        });
      }
      setIsSideRender(false);
    }
    setIsFirstRender(false);
  }, [response]);

  useEffect(() => {
    setHasUnreadMessages(
      listThread.some(
        (thread) =>
          !thread?.is_match &&
          thread?.last_message?.sender !== userInfo?.id &&
          thread.unread_count > 0 &&
          thread.thread_id !== isActiveChat
      )
    );
  }, [listThread, userInfo?.id]);

  useEffect(() => {
    if (!token) {
      router.push("/auth-login");
    }
  }, [token]);

  useEffect(() => {
    setIsSideRender(false);
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const recipientId = searchParams.get("recipientId");

    if (recipientId && listThread.length > 0) {
      const thread = listThread.find(
        (item) => item.recipient.id === recipientId
      );
      if (thread) {
        handleOpenChatDetail(
          thread.thread_id,
          thread.recipient.id,
          thread.is_match,
          thread?.last_message?.sender,
          thread?.is_pin,
          thread?.delete_by,
          thread?.user_id
        );
        setIsModalOpen(recipientId);
      }
    }

    const abc = listThread?.find((item) => item.thread_id === isActiveChat);

    if (!!abc) {
      setIsMatch(abc?.is_match);
    }

    if (!!abc?.delete_by) {
      setIsDeleted(abc?.delete_by !== abc.user_id ? "is_deleted" : "deleted");
    } else {
      setIsDeleted(null);
    }
  }, [listThread]);

  const handleSelectTab = (tab) => {
    setIsActiveTab(tab);
    if (tab === "all") {
      router.replace(`/chats`, undefined, { shallow: true });
    } else {
      router.replace(`/chats?tab=${tab}`, undefined, { shallow: true });
    }
  };

  const handleOpenChatDetail = (
    thread_id,
    recipient_id,
    is_match,
    last_sender,
    is_pin,
    delete_by,
    user_id
  ) => {
    setIsLoadingChat(true);
    setIsActiveChat(thread_id);
    setIsChangeChat(thread_id);
    setLastSender(last_sender);
    setIsMatch(is_match);
    setIsPin(is_pin);
    setIsDeleted(
      !!delete_by && delete_by !== user_id
        ? "is_deleted"
        : !!delete_by
        ? "deleted"
        : null
    );
    if (thread_id === null) {
      setIsModalOpen(false);
    } else {
      setIsModalOpen(recipient_id);
    }

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
            <>
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
                      className={`tab-item flex items-center justify-center relative ${
                        isActiveTab === "unread"
                          ? "bg-[#ffffff] text-[#343434]"
                          : "text-[#ffffff]"
                      }`}
                      onClick={() => handleSelectTab("unread")}
                    >
                      Unread
                      {hasUnreadMessages && (
                        <div className="w-[10px] h-[10px] bg-red-500 rounded-full absolute top-[-2px] right-[-2px]"></div>
                      )}
                    </div>
                  </div>
                </>
              </div>
              {isSideRender ? (
                <div className="w-100 h-[60vh] flex items-center justify-center">
                  <BeatLoader color="#fff" size={10} />
                </div>
              ) : (
                <div className="chat-detail">
                  {listThread
                    ?.filter((thread) => {
                      if (isActiveTab === "all") {
                        return (
                          (thread?.is_match === true ||
                            (!thread.is_match &&
                              thread?.last_message?.sender === userInfo?.id)) &&
                          !thread?.delete_by
                        );
                      }
                      if (isActiveTab === "pinned") {
                        return (
                          thread?.is_pin === true && thread?.is_match === true
                        );
                      }
                      if (isActiveTab === "unread") {
                        return (
                          (!thread?.is_match &&
                            thread?.last_message?.sender !== userInfo?.id) ||
                          !!thread?.delete_by
                        );
                      }
                      return true;
                    })
                    ?.sort((a, b) => {
                      const timeA = moment(a.updated_at);
                      const timeB = moment(b.updated_at);

                      if (a.is_pin && !b.is_pin) {
                        return -1;
                      }
                      if (!a.is_pin && b.is_pin) {
                        return 1;
                      }

                      return timeB.diff(timeA);
                    })

                    ?.map((thread) => {
                      if (!thread.thread_id) {
                        return;
                      }
                      const sanitizedContent =
                        thread?.last_message?.content.replace(
                          /<br\s*\/?>/gi,
                          ""
                        );
                      return (
                        <div
                          className={`chat-item ${
                            isActiveChat === thread?.recipient?.id &&
                            "bg-[#222]"
                          }`}
                          key={thread?.recipient?.id}
                          onClick={() => {
                            if (isActiveChat !== thread.thread_id) {
                              handleOpenChatDetail(
                                thread?.thread_id,
                                thread?.recipient?.id,
                                thread?.is_match,
                                thread?.last_message?.sender,
                                thread?.is_pin,
                                thread?.delete_by,
                                thread?.user_id
                              );
                            }
                          }}
                        >
                          <div className="flex items-center gap-[6px]">
                            <div className="chat-avatar">
                              <Image
                                src={thread?.recipient?.avatar || DefaultAvatar}
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
                              <div className="flex items-center w-100">
                                <div className="w-100 chat-name flex items-center">
                                  <span
                                    className="w-100"
                                    style={{
                                      display: "-webkit-box",
                                      WebkitBoxOrient: "vertical",
                                      WebkitLineClamp: 1,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {thread?.recipient?.name}
                                  </span>
                                </div>
                                <div className="w-[12px] chat-name flex items-center">
                                  {thread.is_pin && thread.is_match && (
                                    <div className="chat-pin">
                                      <Image
                                        src={PinIcon}
                                        alt="pin"
                                        width={12}
                                        height={12}
                                        className="ml-[2px]"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                              <span
                                className="last-message"
                                style={
                                  thread?.unread_count > 0 &&
                                  thread?.last_message?.sender !== userInfo?.id
                                    ? { color: "rgba(255, 255, 255, 1)" }
                                    : { color: "rgba(255, 255, 255, 0.40)" }
                                }
                              >
                                {sanitizedContent?.length > 15 ? (
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: `${sanitizedContent.slice(
                                        0,
                                        15
                                      )}...`,
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
                              thread?.last_message?.sender !== userInfo?.id && (
                                <div className="notification">
                                  {thread?.unread_count}
                                </div>
                              )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </>
          </div>
          <div className="chat-container">
            <ChatDetail
              chatId={isActiveChat}
              setChatId={setIsActiveChat}
              handleOpenDetail={handleOpenDetail}
              tab={isActiveTab}
              isChangeChat={isChangeChat}
              isLoading={isLoadingChat}
              setIsLoading={setIsLoadingChat}
              isMatch={isMatch}
              setIsMatch={setIsMatch}
              isPin={isPin}
              setIsPin={setIsPin}
              setIsActiveTab={setIsActiveTab}
              lastSender={lastSender}
              setIsModalOpen={setIsModalOpen}
              setSideRender={() => setIsSideRender(!isSideRender)}
              setListThread={(e) => setListThread(e)}
              isDeleted={isDeleted}
            />
          </div>
          {isModalOpen && <ModalDetail isOpen={isModalOpen} />}
        </>
      )}
    </div>
  );
};

export default Chats;
