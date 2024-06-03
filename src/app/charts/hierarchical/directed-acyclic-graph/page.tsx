import ChartWrapper from "@/components/common/ChartWrapper";
import React from "react";
import ChartUtil from "./ChartUtil";
import { data } from "./data";

const ChartComponent = async () => {
  return (
    <ChartWrapper
      chartTitle="Directed Acyclic Graph"
      directoryPath="/src/app/charts/hierarchical/directed-acyclic-graph"
    >
      <ChartUtil data={data} />
    </ChartWrapper>
  );
};

export default ChartComponent;
