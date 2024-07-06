"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ChartDataType } from "@/utils/fetchChartsUtils";
import IconBxRightArrow from "../icons/IconBxRight";
import IconBxsDownArrow from "../icons/IconBxDownSolid";
import { usePathname } from "next/navigation";
import IconDot16 from "../icons/IconDot16";

const textFormattor = (text: string) =>
  text
    .split(/[-_]+/)
    .map((s) => s[0].toUpperCase().concat(s.slice(1)))
    .join(" ");

const LinkAccordian = ({ linkData }: { linkData: ChartDataType }) => {
  const pathName = usePathname();
  const [accState, setAccState] = useState(false);
  return (
    <div className="w-full flex flex-col gap-0 font-sans text-md font-light border-t border-zinc-500 first:border-0">
      <div
        className="header h-16 bg-zinc-800 flex items-center px-12 justify-between"
        onClick={() => setAccState((s) => !s)}
      >
        <p className="font-normal">
          {textFormattor(linkData.chartType)}
        </p>
        {accState ? <IconBxsDownArrow /> : <IconBxRightArrow />}
      </div>
      {accState && (
        <div className="content flex flex-col p-0 gap-0 bg-zinc-700">
          {linkData.charts.map((chart) => (
            <Link
              href={`/charts/${linkData.chartType}/${chart}`}
              key={`/charts/${linkData.chartType}/${chart}`}
              className="h-12 flex items-center gap-4 hover:bg-zinc-500 px-12"
            > <IconDot16 width={24} className={pathName === `/charts/${linkData.chartType}/${chart}` ? 'stroke-rose-600 fill-rose-600' : ''} height={24} />
              {textFormattor(chart)}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default LinkAccordian;
