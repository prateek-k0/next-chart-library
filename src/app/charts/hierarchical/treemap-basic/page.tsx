import ChartWrapper from "@/components/common/ChartWrapper";
import React from "react";
import ChartUtil from "./ChartUtil";

const ChartComponent = async () => {
  const data = await fetch(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_dendrogram_full.json"
  ).then((res) => res.json());
  return (
    <ChartWrapper
      chartTitle="Basic Treemap"
      directoryPath="/src/app/charts/hierarchical/treemap-basic"
    >
      <ChartUtil data={data} />
    </ChartWrapper>
  );
};

export default ChartComponent;
