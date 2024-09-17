"use client";

import Sidebar from "@/components/layout/Sidebar";
import "./styles.css";
import { usePathname, useRouter } from "next/navigation";

export default function Layout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const isHaveSidebar = pathname === "/news";

  return (
    <div className="wrapper">
      {isHaveSidebar && <Sidebar />}
      {children}
    </div>
  );
}
