"use client";

import Sidebar from "@/components/layout/Sidebar";
import "./styles.css";
import { usePathname, useRouter } from "next/navigation";
import ModalLayer from "@/components/layout/ModalLayer";
import { useState } from "react";

export default function Layout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [openModalSetting, setOpenModalSetting] = useState(false);

  const isHaveSidebar = pathname === "/news";

  const toggleOpenModalSetting = () => {
    setOpenModalSetting(!openModalSetting);
  };

  return (
    <>
      <div className="wrapper">
        {isHaveSidebar && (
          <Sidebar toggleOpenModalSetting={toggleOpenModalSetting} />
        )}
        {children}
        {openModalSetting && <ModalLayer toggleOpenModalSetting={toggleOpenModalSetting}/>}
      </div>
    </>
  );
}
