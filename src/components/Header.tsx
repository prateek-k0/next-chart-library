"use client";
import React, { useCallback, useState } from "react";
import IconMenuOutline from "./icons/IconMenuOutline";
import { ChartDataType } from "@/utils/fetchChartsUtils";
import SideBar from "./SideBar";
import IconCross from "./icons/IconsCross";
import IconHome from "./icons/IconHome";
import Link from "next/link";
import IconGithub from "./icons/IconGithub";
import BrandLogo from "./common/BrandLogo";

const Header = ({ fileData }: { fileData: ChartDataType[] }) => {
  const [sideBarStatus, setSideBarStatus] = useState(false);
  const closeHandler = useCallback(() => {
    setSideBarStatus(false);
  }, [])
  return (
    <>
      <header className="h-16 bg-zinc-800 border-b border-zinc-600 flex items-center px-12 relative justify-between">
        <div className="brand flex items-center gap-4 divide-x">
          <div
            className="menu-trigger hover:text-rose-600"
            onClick={() => setSideBarStatus((s) => !s)}
          >
            {sideBarStatus ? <IconCross width={32} height={32} className=" cursor-pointer" /> : <IconMenuOutline width={32} height={32} className="cursor-pointer" />}
          </div>
          <Link href="/" className=""><IconHome width={44} height={28} className="pl-4 cursor-pointer hover:text-rose-600" /></Link>
        </div>
        <div className="brand-logo w-16 h-16 -ml-16">
          <BrandLogo />
        </div>
        <div className="exteral-nav flex items-center gap-4">
        <Link href="https://github.com/prateek-k0/next-chart-library" target="_blank" className="">
          <IconGithub width={32} height={32} className="cursor-pointer hover:text-rose-600" />
        </Link>
        </div>
      </header>
      {sideBarStatus && <SideBar fileData={fileData} onClose={closeHandler} />}
    </>
  );
};

export default Header;
