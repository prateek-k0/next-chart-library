import React from 'react'
import ChartWrapper from "@/components/common/ChartWrapper";
import ChartUtil from './ChartUtil';

const data = [
  {
    focusGroup: 'Iaas',
    value: 36,
  },
  {
    focusGroup: 'Paas',
    value: 56,
  },
  {
    focusGroup: 'App Dev',
    value: 46,
  },
  {
    focusGroup: 'App Support',
    value: 20,
  },
  {
    focusGroup: 'Commute',
    value: 96,
  },
  {
    focusGroup: 'Network',
    value: 46,
  },
  {
    focusGroup: 'Storage',
    value: 46,
  },
  {
    focusGroup: 'On prem',
    value: 30,
  },
  {
    focusGroup: 'Saas',
    value: 68,
  },
];

const ChartComponent = async () => {
  return (
    <ChartWrapper
      chartTitle="3D Bar Chart"
      directoryPath="/src/app/charts/3D/bar-chart"
    >
      <ChartUtil data={data} />
    </ChartWrapper>
  );
};

export default ChartComponent;