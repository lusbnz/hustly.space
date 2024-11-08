"use client";

import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import Badge from "@/components/common/Badge";
import ModalDetail from "@/components/layout/ModalDetail";
import UserIcon from "@/public/icons/user2-icon.svg";
import BirthdayIcon from "@/public/icons/birthday-icon.svg";
import LocationIcon from "@/public/icons/location-icon.svg";
import Image from "next/image";
import { useSelector } from "react-redux";
import { checkThread, createThread } from "@/api/thread";
import { removeVietnameseTones } from "@/utils/utils";
import { BeatLoader } from "react-spinners";
import { getSuggestions } from "@/api/profile";
import InfiniteScroll from "react-infinite-scroller";
import DefaultAvatar from "@/public/images/user-default.jpg";

const News = () => {
  const filterData = useSelector((state) => state.suggestion.filterData);
  const userInfo = useSelector((state) => state.userInfo.userInfo);
  const university = useSelector((state) => state.university);
  const domain = useSelector((state) => state.domain);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suggestionData, setSuggestionData] = useState([]);
  const suggestion = useSelector((state) => state.suggestion.results);
  const [check, setCheck] = useState(null);
  const [paramsData, setParamsData] = useState();
  const [isClient, setIsClient] = useState(false);

  const loading = useRef(false);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [isFirstRender, setIsFirstRender] = useState(true);

  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  // useEffect(() => {
  //   const sp = isClient ? new URLSearchParams(window.location.search) : null;
  //   const res = sp ? sp.get("verify") : null;
  //   if (!!res) {
  //     toast.success("Check your email to verify your account.");
  //   }
  // }, [isClient]);

  useEffect(() => {
    setSuggestionData(suggestion);
    setParamsData(filterData);
    if (suggestion?.length < 10) {
      setHasMore(false);
    }
  }, [suggestion, filterData]);

  const loadChild = () => {
    setIsFirstRender(false);
    if (loading.current || !hasMore || isFirstRender) return;
    loading.current = true;

    let data = { page };

    if (!!paramsData) {
      data = { ...paramsData, page };
    }

    getSuggestions(data)
      .then((res) => {
        setSuggestionData((prevSuggestionData) => [
          ...prevSuggestionData,
          ...res?.data?.results,
        ]);

        if (res?.data?.results?.length < 10) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      })
      .catch((err) => {
        console.log("err", err);
        setHasMore(false);
      })
      .finally(() => {
        setPage(page + 1);
        loading.current = false;
      });
  };

  const infiniteScrollLoader = (
    <div
      className="w-100 d-flex items-center justify-center h-[400px]"
      style={{
        marginLeft: "calc((440 / 1920) * 100vw)",
      }}
    >
      <BeatLoader size={10} color="#fff" />
    </div>
  );

  const handleDetailCard = (index) => {
    if (isModalOpen === index) {
      setIsModalOpen(false);
    } else {
      const data = {
        to_user_id: index,
        is_check: true,
      };
      createThread(userInfo.id, data)
        .then((res) => {
          setCheck(res.thread_id);
        })
        .catch((err) => {
          console.log(err);
        });
      setIsModalOpen(index);
    }
  };

  const universityOptions = university?.map((item) => {
    return {
      value: String(item.id),
      label: removeVietnameseTones(item.name),
    };
  });

  const searchParams = new URLSearchParams(window.location.search);
  const rel = searchParams.get("rel");

  useEffect(() => {
    if (!!rel) {
      setIsModalOpen(rel);
      window.history.replaceState(null, null, window.location.pathname);
    }
  }, [rel]);

  function hexToRgb(hex) {
    hex = hex.replace("#", "");
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return [r, g, b];
  }

  function rgbToHex(r, g, b) {
    return (
      "#" +
      ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
    );
  }

  function lightenColor(hex, factor = 0.5) {
    let [r, g, b] = hexToRgb(hex);
    r = Math.round(r + (255 - r) * factor);
    g = Math.round(g + (255 - g) * factor);
    b = Math.round(b + (255 - b) * factor);
    return rgbToHex(r, g, b);
  }

  function darkenColor(hex, factor = 0.5) {
    let [r, g, b] = hexToRgb(hex);
    r = Math.round(r * (1 - factor));
    g = Math.round(g * (1 - factor));
    b = Math.round(b * (1 - factor));
    return rgbToHex(r, g, b);
  }

  return (
    <>
      <div className="news-wrapper">
        <div className="flex flex-col">
          <span className="greeting">
            Hello {userInfo?.first_name}! tim dong chi?
          </span>
          <span className="description">Have you found a partner yet?</span>
        </div>
        <InfiniteScroll
          loadMore={loadChild}
          hasMore={hasMore}
          useWindow={false}
          loader={
            !!suggestionData &&
            suggestionData?.length > 0 &&
            infiniteScrollLoader
          }
        >
          <div className="card-wrapper grid grid-cols-1 md:grid-cols-2 pb-12 mb-12">
            {!!suggestionData &&
              suggestionData?.map((item) => {
                const uni = universityOptions.find((e) => e.id === item?.city);

                return (
                  <div
                    className="card-item"
                    key={item.id}
                    onClick={() => handleDetailCard(item.id)}
                  >
                    <div className="card-header flex">
                      <div className="avatar">
                        <Image
                          src={item?.avatar?.file || DefaultAvatar}
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
                      <div className="flex flex-col info justify-center">
                        <span className="name flex items-center gap-[4px]">
                          <span
                            className="lh-1 h-[12px]text-center"
                            style={{
                              fontSize:
                                "clamp(14px, calc((22 / 1920) * 100vw), 26px)",
                            }}
                          >
                            {item.first_name} {item.last_name}
                          </span>

                          <div
                            className={`w-[10px] h-[10px] rounded-full`}
                            style={{ backgroundColor: item.color || "#ffffff" }}
                          ></div>
                        </span>
                        <div className="flex gap-[24px] items-center">
                          <div className="location flex items-start gap-[4px]">
                            <Image
                              src={LocationIcon}
                              alt="location-icon"
                              width={12}
                              height={12}
                            />
                            <span>{uni || "Hanoi"}</span>
                          </div>
                          <div className="location flex items-start gap-[4px]">
                            <Image
                              src={BirthdayIcon}
                              alt="birth-icon"
                              width={12}
                              height={12}
                            />
                            <span>{item.age || "18"}</span>
                          </div>
                          <div className="location h-[16px] flex items-start gap-[4px]">
                            <Image
                              src={UserIcon}
                              alt="mem-icon"
                              width={12}
                              height={12}
                            />
                            <span>{item.team_member_count}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <span className="description">
                        {item.bio?.length > 100
                          ? item.bio?.slice(0, 100) + "..."
                          : item.bio}
                      </span>
                      <div className="tags">
                        {[
                          ...new Set(
                            item.domain?.map(
                              (domainItem) =>
                                domainItem.parent_domain ?? domainItem.id
                            )
                          ),
                        ].map((uniqueId) => {
                          const mainDomain = domain?.find(
                            (e) => e.id === uniqueId
                          );

                          const color = mainDomain?.color;
                          const sd = mainDomain?.name;

                          return (
                            <Badge
                              key={uniqueId}
                              backgroundColor={lightenColor(color, 0.5)}
                              color={darkenColor(color, 0.3)}
                              name={sd}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </InfiniteScroll>
      </div>
      {isModalOpen !== false && (
        <ModalDetail
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          check={check}
        />
      )}
    </>
  );
};

export default News;
