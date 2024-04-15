import ChartWrapper from '@/components/common/ChartWrapper';
import React from 'react'
import ChartUtil from './ChartUtil';

const data = [
  {
    month: 'Aug',
    Defect: '10',
    Flag: '30',
    Good: '40',
  },
  {
    month: 'Sep',
    Defect: '90',
    Flag: '50',
    Good: '60',
  },
  {
    month: 'Oct',
    Defect: '120',
    Flag: '100',
    Good: '80',
  },
  {
    month: 'Nov',
    Defect: '130',
    Flag: '50',
    Good: '120',
  },
  {
    month: 'Dec',
    Defect: '200',
    Flag: '80',
    Good: '100',
  },
  {
    month: 'Jan',
    Defect: '160',
    Flag: '90',
    Good: '80',
  },
];

const ChartComponent = () => {
  return (
    <ChartWrapper
      chartTitle="Stacked Bar Chart"
      directoryPath="./src/components/charts/bar-charts/stacked-bar-chart"
    >
      <ChartUtil data={data} />
    </ChartWrapper>
  );
}

export default ChartComponent