"use client";

import Sidebar from "@/components/layout/Sidebar";
import "./styles.css";
import { usePathname, useRouter } from "next/navigation";
import ModalLayer from "@/components/layout/ModalLayer";
import { useEffect, useState } from "react";
import { getProfile } from "@/api/profile";
import { getCompetion, getDomain, getUniversity } from "@/api/option";

export default function Layout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = localStorage.getItem("accessToken");

  const [openModalSetting, setOpenModalSetting] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isFirstRenderFilter, setIsFirstRenderFilter] = useState(true);
  const [isSidebarLoading, setIsSidebarLoading] = useState(true);

  const isHaveSidebar = pathname === "/news";

  const toggleOpenModalSetting = () => {
    setOpenModalSetting(!openModalSetting);
  };

  const fetchProfile = () => {
    setIsSidebarLoading(true);
    getProfile()
      .then((res) => {
        localStorage.setItem("userData", JSON.stringify(res));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchCompetion = () => {
    getCompetion()
      .then((res) => {
        localStorage.setItem("competion", JSON.stringify(res));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchUniversity = () => {
    getUniversity()
      .then((res) => {
        localStorage.setItem("university", JSON.stringify(res));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchDomain = () => {
    getDomain()
      .then((res) => {
        localStorage.setItem("domain", JSON.stringify(res));
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
          />
        )}
        {children}
        {openModalSetting && (
          <ModalLayer toggleOpenModalSetting={toggleOpenModalSetting} />
        )}
      </div>
    </>
  );
}
