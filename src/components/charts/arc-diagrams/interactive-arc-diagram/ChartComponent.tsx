import ChartWrapper from "@/components/common/ChartWrapper";
import React from "react";
import ChartUtil from "./ChartUtil";

const ChartComponent = async () => {
  const data = await fetch(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_researcherNetwork.json"
  ).then((res) => res.json());
  return (
    <ChartWrapper
      chartTitle="Interactive Arc Diagram"
      directoryPath="./src/components/charts/arc-diagrams/interactive-arc-diagram"
    >
      <ChartUtil data={data} />
    </ChartWrapper>
  );
};

export default ChartComponent;
