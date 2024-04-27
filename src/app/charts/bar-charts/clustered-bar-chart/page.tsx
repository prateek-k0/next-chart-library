import ChartWrapper from "@/components/common/ChartWrapper";
import React from "react";
import ChartUtil from "./ChartUtil";

const data = [
  {
    Contracts: "Effort",
    v1: 1163,
    v2: 2567,
    v3: 4860,
  },
  {
    Contracts: "Schedule",
    v1: 2448,
    v2: 3442,
    v3: 2700,
  },
  {
    Contracts: "Quality",
    v1: 2531,
    v2: 2653,
    v3: 3406,
  },
  {
    Contracts: "Scope & Prod.",
    v1: 2004,
    v2: 2857,
    v3: 3729,
  },
  {
    Contracts: "Service Perf.",
    v1: 3880,
    v2: 2365,
    v3: 2345,
  },
  {
    Contracts: "Resouces",
    v1: 1662,
    v2: 2885,
    v3: 4517,
  },
];

const ChartComponent = () => {
  return (
    <ChartWrapper
      chartTitle="Clustered Bar Chart"
      directoryPath="/src/app/charts/bar-charts/clustered-bar-chart"
    >
      <ChartUtil data={data} />
    </ChartWrapper>
  );
};

export default ChartComponent;
