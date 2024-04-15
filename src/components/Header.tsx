"use client";
import React, { useCallback, useState } from "react";
import IconMenuOutline from "./icons/IconMenuOutline";
import { ChartDataType } from "@/utils/fetchChartsUtils";
import SideBar from "./SideBar";
import IconCross from "./icons/IconsCross";

const Header = ({ fileData }: { fileData: ChartDataType[] }) => {
  const [sideBarStatus, setSideBarStatus] = useState(false);
  const closeHandler = useCallback(() => {
    setSideBarStatus(false);
  }, [])
  return (
    <>
      <header className="h-16 bg-zinc-800 border-b border-zinc-600 flex items-center px-12 relative justify-between">
        <div
          className="menu-trigger"
          onClick={() => setSideBarStatus((s) => !s)}
        >
          {sideBarStatus ? <IconCross width={32} height={32} /> : <IconMenuOutline width={32} height={32} />}
        </div>
        <p className="brand">Next.js Chart Library</p>
      </header>
      {sideBarStatus && <SideBar fileData={fileData} onClose={closeHandler} />}
    </>
  );
};

export default Header;
