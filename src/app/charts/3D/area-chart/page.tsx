import React from 'react'
import ChartWrapper from "@/components/common/ChartWrapper";
import ChartUtil from './ChartUtil';

const data = [
  {
    focusGroup: 'Iaas',
    value: 36,
    lineValue: 40,
    color: '#175F8C',
  },
  {
    focusGroup: 'Paas',
    value: 56,
    lineValue: 45,
    color: '#175F8C',
  },
  {
    focusGroup: 'App Dev',
    value: 46,
    lineValue: 12,
    color: '#175F8C',
  },
  {
    focusGroup: 'App Support',
    value: 20,
    lineValue: 70,
    color: '#175F8C',
  },
  {
    focusGroup: 'Commute',
    value: 96,
    lineValue: 91,
    color: '#175F8C',
  },
  {
    focusGroup: 'Network',
    value: 46,
    lineValue: 40,
    color: '#175F8C',
  },
  {
    focusGroup: 'Storage',
    value: 46,
    lineValue: 90,
    color: '#175F8C',
  },
  {
    focusGroup: 'On prem',
    value: 30,
    lineValue: 43,
    color: '#175F8C',
  },
  {
    focusGroup: 'Saas',
    value: 68,
    lineValue: 57,
    color: '#175F8C',
  },
];

const ChartComponent = async () => {
  return (
    <ChartWrapper
      chartTitle="3D Area Chart"
      directoryPath="/src/app/charts/3D/area-chart"
    >
      <ChartUtil data={data} />
    </ChartWrapper>
  );
};

export default ChartComponent;