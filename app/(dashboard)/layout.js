"use client";

import Sidebar from "@/components/layout/Sidebar";
import "./styles.css";
import { usePathname, useRouter } from "next/navigation";
import ModalLayer from "@/components/layout/ModalLayer";
import React, { useEffect, useState } from "react";
import { getProfile, getSuggestions } from "@/api/profile";
import { getCompetion, getDomain, getUniversity } from "@/api/option";
import { BeatLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/reducers/userInfoSlice";
import { setcompetition } from "@/reducers/competitionSlice";
import { setUniversity } from "@/reducers/universitySlice";
import { setDomain } from "@/reducers/domainSlice";
import { setSuggestion } from "@/reducers/suggestionSlice";

export default function Layout({ children }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [openModalSetting, setOpenModalSetting] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstRenderFilter, setIsFirstRenderFilter] = useState(true);
  const [isSidebarLoading, setIsSidebarLoading] = useState(true);
  const [filter, setFilter] = useState({
    university__id: "",
    team_member_count: "",
    city: "",
    competition__id: "",
    domain_id: "",
    skill_set: "",
  });

  const isHaveSidebar = pathname === "/news";

  const toggleOpenModalSetting = () => {
    setOpenModalSetting(!openModalSetting);
  };

  const fetchSuggestion = (data) => {
    setIsLoading(true);
    getSuggestions(data)
      .then((res) => {
        dispatch(setSuggestion(res));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchSuggestion();
  }, []);

  useEffect(() => {
    if (!isFirstRender) {
      const data = {
        university__id: filter.university__id,
        team_member_count: filter.team_member_count,
        city: filter.city,
        competition__id: filter.competition__id,
        domain_id: filter.domain_id,
        skill_set: filter.skill_set,
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
    };

    fetchSuggestion(data);
  };

  const fetchProfile = () => {
    setIsSidebarLoading(true);
    getProfile()
      .then((res) => {
        dispatch(setUserInfo(res));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchCompetion = () => {
    getCompetion()
      .then((res) => {
        dispatch(setcompetition(res));
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

  useEffect(() => {
    if (isFirstRender) {
      fetchProfile();
      setIsFirstRender(false);
      setIsSidebarLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isHaveSidebar && isFirstRenderFilter) {
      fetchCompetion();
      fetchUniversity();
      fetchDomain();
      setIsFirstRenderFilter(false);
    }
  }, [isHaveSidebar]);

  return (
    <>
      <div className="wrapper">
        {isHaveSidebar && (
          <Sidebar
            toggleOpenModalSetting={toggleOpenModalSetting}
            isSidebarLoading={isSidebarLoading}
            search={search}
            setFilter={setFilter}
          />
        )}
        {isLoading && pathname === "/news" ? (
          <div className="w-screen h-[80vh] bg-black flex items-center justify-center">
            <BeatLoader color="#fff" size={16} />
          </div>
        ) : (
          children
        )}
        {openModalSetting && (
          <ModalLayer toggleOpenModalSetting={toggleOpenModalSetting} />
        )}
      </div>
    </>
  );
}
