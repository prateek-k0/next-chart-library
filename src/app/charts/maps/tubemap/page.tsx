import ChartWrapper from "@/components/common/ChartWrapper";
import React from "react";
import ChartUtil from "./ChartUtil";
import data from './data.json';

const ChartComponent = async () => {
  return (
    <ChartWrapper
      chartTitle="Tubemap"
      directoryPath="/src/app/charts/maps/tubemap"
    >
      <ChartUtil data={data} />
    </ChartWrapper>
  );
};

export default ChartComponent;
