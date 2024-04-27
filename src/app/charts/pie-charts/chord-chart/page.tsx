import React from "react";
import ChartWrapper from "@/components/common/ChartWrapper";
import ChartUtil from "./ChartUtil";

const data = [
  [0, 5871, 8916, 2868],
  [1951, 0, 2060, 6171],
  [8010, 16145, 0, 8045],
  [1013, 990, 940, 0],
];

const ChartComponent = () => {
  return (
    <ChartWrapper
      chartTitle="Chord Chart"
      directoryPath="/src/app/charts/pie-charts/chord-chart"
    >
      <ChartUtil data={data} />
    </ChartWrapper>
  );
};

export default ChartComponent;
