import ChartWrapper from "@/components/common/ChartWrapper";
import React from "react";
import ChartUtil from "./ChartUtil";
import { data } from "./data";

const ChartComponent = async () => {
  return (
    <ChartWrapper
      chartTitle="Organization Chart"
      directoryPath="/src/app/charts/hierarchical/organization"
    >
      <ChartUtil data={data} />
    </ChartWrapper>
  );
};

export default ChartComponent;
