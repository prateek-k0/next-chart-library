import ChartWrapper from "@/components/common/ChartWrapper";
import React from "react";
import ChartUtil from "./ChartUtil";
import rawData from "./brand_values.json";

const ChartComponent = async () => {
  return (
    <ChartWrapper
      chartTitle="Racing Bar Chart"
      directoryPath="/src/app/charts/bar-charts/racing-bar-chart"
    >
      <ChartUtil data={rawData} />
    </ChartWrapper>
  );
};

export default ChartComponent;
