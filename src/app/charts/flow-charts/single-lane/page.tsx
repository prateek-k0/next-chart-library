import React from 'react'
import ChartWrapper from "@/components/common/ChartWrapper";
import ChartUtil from './ChartUtil';
import { data } from './data';

const ChartComponent = async () => {
  return (
    <ChartWrapper
      chartTitle="Single Lane Flow Chart"
      directoryPath="/src/app/charts/flow-charts/single-lane"
    >
      <ChartUtil data={data} />
    </ChartWrapper>
  );
};

export default ChartComponent;