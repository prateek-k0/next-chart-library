import React from "react";
import ChartWrapper from "@/components/common/ChartWrapper";
import ChartUtil from "./ChartUtil";

const data = [
  { value: 5, color: "#6D6ACC", radius: 0 },
  { value: 2, color: "#7188DC", radius: 0 },
  { value: 2, color: "#75A5EB", radius: 0 },
  { value: 2, color: "#67B7DC", radius: 0 },
  { value: 5, color: "#67CABD", radius: 0 },
  { value: 2, color: "#8FD399", radius: 0 },
  { value: 2, color: "#B7DC75", radius: 0 },
  { value: 5, color: "#DCDC67", radius: 0 },
  { value: 5, color: "#DCC467", radius: 0 },
  { value: 2, color: "#D7A267", radius: 0 },
  { value: 2, color: "#E1E1E1", radius: 0 },
  { value: 2, color: "#F3A6CD", radius: 0 },
  { value: 2, color: "#ED88BB", radius: 0 },
  { value: 2, color: "#E769A8", radius: 0 },
  { value: 2, color: "#DC67CE", radius: 0 },
  { value: 2, color: "#9657D5", radius: 0 },
  { value: 56, color: "#60607F", radius: 0 },
];

const ChartComponent = () => {
  return (
    <ChartWrapper
      chartTitle="Pie Chart - Percentage Distribution"
      directoryPath="./src/components/charts/pie-charts/percentage-distribution"
    >
      <ChartUtil data={data} />
    </ChartWrapper>
  );
};

export default ChartComponent;
