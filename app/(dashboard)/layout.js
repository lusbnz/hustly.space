"use client";

import Sidebar from "@/components/layout/Sidebar";
import "./styles.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ModalLayer from "@/components/layout/ModalLayer";
import React, { useEffect, useState } from "react";
import { getProfile, getSuggestions } from "@/api/profile";
import { getCompetion, getDomain, getUniversity } from "@/api/option";
import { BeatLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "@/reducers/userInfoSlice";
import { setCompetition } from "@/reducers/competitionSlice";
import { setUniversity } from "@/reducers/universitySlice";
import { setDomain } from "@/reducers/domainSlice";
import { setFilterData, setSuggestion } from "@/reducers/suggestionSlice";
import { getAuthToken } from "@/libs/clients";
import Head from "next/head";
import ModalChangePassword from "@/components/layout/ModalChangePassword";

export default function Layout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo.userInfo);
  const [openModalSetting, setOpenModalSetting] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstRenderFilter, setIsFirstRenderFilter] = useState(true);
  const [isSidebarLoading, setIsSidebarLoading] = useState(true);
  const [filter, setFilter] = useState({
    university__id: "",
    team_member_count: "",
    city: "",
    competition__id: "",
    domain__id: "",
    skill_set: "",
    age__gte: 18,
    age__lte: 25,
    competition__year: "",
  });
  const [isFirstSetting, setIsFirstSetting] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);

  const isHaveSidebar = pathname === "/news";

  useEffect(() => {
    // if(!userInfo?.id && !isFirstRender) {
    //   fetchProfile()
    // }
  }, [userInfo]);

  const toggleOpenModalSetting = () => {
    setIsChangePassword(false);
    setOpenModalSetting(!openModalSetting);
  };

  const fetchSuggestion = (data) => {
    setIsLoading(true);
    getSuggestions(data)
      .then((res) => {
        dispatch(setFilterData(data));
        dispatch(setSuggestion(res.data.results));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const accessToken = getAuthToken();
    const searchParams = new URLSearchParams(window.location.search);
    const rel = searchParams.get("rel");

    if (!accessToken && isHaveSidebar) {
      if (rel) {
        router.push(`/auth-login?rel=${rel}`);
      } else {
        router.push("/auth-login");
      }
    }
  }, []);

  useEffect(() => {
    if (!isFirstRender) {
      const data = {
        page: 1,
        size: 10,
        university__id: filter.university__id,
        team_member_count: filter.team_member_count,
        city: filter.city,
        competition__id: filter.competition__id,
        domain__id: filter.domain__id,
        skill_set: Array.isArray(filter.skill_set)
          ? filter.skill_set.join(",")
          : "",
        age__gte: filter.age__gte,
        age__lte: filter.age__lte,
        competition__year: filter.competition__year,
        gender: filter.gender,
      };

      for (const key in data) {
        if (data[key] === "" || data[key] === null) {
          delete data[key];
        }
      }

      fetchSuggestion(data);
    }
  }, [filter]);

  const search = (value) => {
    const data = {
      search: value,
      page: 1,
      size: 10,
    };

    fetchSuggestion(data);
  };
  // x

  const fetchProfile = () => {
    setIsSidebarLoading(true);
    getProfile()
      .then((res) => {
        if (!res.is_update_setting) {
          setIsFirstSetting(true);
          setOpenModalSetting(true);
        }
        dispatch(setUserInfo(res));
      })
      .catch((err) => {
        console.log(err);
        window.localStorage.removeItem("accessToken");
        const searchParams = new URLSearchParams(window.location.search);
        const rel = searchParams.get("rel");

        if (rel) {
          router.push(`/auth-login?rel=${rel}`);
        } else {
          router.push("/auth-login");
        }
      });
  };

  const fetchCompetion = () => {
    getCompetion()
      .then((res) => {
        dispatch(setCompetition(res));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchUniversity = () => {
    getUniversity()
      .then((res) => {
        dispatch(setUniversity(res));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchDomain = () => {
    getDomain()
      .then((res) => {
        dispatch(setDomain(res));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleOpenChangePassword = () => {
    setOpenModalSetting(false);
    setIsChangePassword(!isChangePassword);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isHaveSidebar && isFirstRenderFilter) {
        await Promise.all([fetchCompetion(), fetchUniversity(), fetchDomain()]);
        if (isFirstRender) {
          fetchProfile();
          setIsFirstRender(false);
          setIsSidebarLoading(false);
        }
        setIsFirstRenderFilter(false);
      }
    };

    fetchData();
  }, [isHaveSidebar]);

  return (
    <>
      <Head>
        <title>hustly.space</title>
        <link rel="icon" href="/icons/logo-icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/logo-icon.svg" />
      </Head>
      <div className="wrapper">
        {isHaveSidebar && (
          <Sidebar
            toggleOpenModalSetting={toggleOpenModalSetting}
            isSidebarLoading={isSidebarLoading}
            search={search}
            filter={filter}
            setFilter={setFilter}
          />
        )}
        {isLoading && pathname === "/news" ? (
          <div className="w-screen h-[100vh] bg-black flex items-center justify-center">
            <BeatLoader color="#fff" size={10} />
          </div>
        ) : (
          children
        )}
        {openModalSetting && (
          <ModalLayer
            toggleOpenModalSetting={toggleOpenModalSetting}
            isFirstSetting={isFirstSetting}
            toggleOpenChangePassword={toggleOpenChangePassword}
          />
        )}

        {isChangePassword && (
          <ModalChangePassword
            toggleOpenModalSetting={toggleOpenModalSetting}
          />
        )}
      </div>
    </>
  );
}
