import React from "react";
import ChartWrapper from "@/components/common/ChartWrapper";
import ChartUtil from "./ChartUtil";

const data = [
  { percentage: 40, label: "Point 1" },
  { percentage: 30, label: "Point 2" },
  { percentage: 20, label: "Point 3" },
  { percentage: 10, label: "Point 4" },
];

const ChartComponent = () => {
  return (
    <ChartWrapper
      chartTitle="Donut Chart"
      directoryPath="./src/components/charts/pie-charts/donut-chart"
    >
      <ChartUtil data={data} />
    </ChartWrapper>
  );
};

export default ChartComponent;
