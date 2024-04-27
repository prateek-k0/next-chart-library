import React from "react";
import CodeBlock from "./CodeBlock";
import { fetchChartText, fetchChartsFromDirectory } from "@/utils/fetchChartsUtils";
import path from "path";

const ChartWrapper = async ({
  chartTitle,
  children,
  directoryPath
}: {
  chartTitle: string;
  children: React.ReactNode;
  directoryPath: string,
}) => {
  try {
    const codeFileNames = await fetchChartsFromDirectory(path.join(process.cwd() + directoryPath));
    console.log('ChartWrapper.tsx: ', directoryPath, codeFileNames)
  } catch (e) {
    console.log(e);
  }
  // const codeStrings = await Promise.all(codeFileNames.map(fileName => fetchChartText(`${directoryPath}/${fileName}`)));
  // const codesHTML = (codeFileNames.map((fileName, i: number) => (
  //   <div key={fileName} className="gap-4">
  //     <p className="snippet-title text-lg font-mono">{fileName}</p>
  //     <CodeBlock scriptText={codeStrings[i]} />
  //   </div>
  // )));
  return (
    <div className="px-12 pt-8 pb-8 font-mono flex flex-col gap-4">
      <p className="text-3xl font-mono font-semibold">{chartTitle}</p>
      {children}
      {/* {codeFileNames.length > 0 && (
        <>
          <p className="snippet-title text-2xl mt-4 font-mono font-semibold">Code</p>
          {codesHTML}
        </>
      )} */}
    </div>
  );
};

export default ChartWrapper;
