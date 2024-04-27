import React from 'react'
import ChartWrapper from "@/components/common/ChartWrapper";
import ChartUtil from "./ChartUtil";

const data = {
  name: '',
  children: [
    {
      name: 'query',
      color: '#004dff',
      children: [
        {
          name: 'SD',
          value: 13896,
        },
      ],
    },
    {
      name: 'util',
      color: '#46BDF0',
      children: [
        {
          name: 'SD',
          value: 8258,
        },
        {
          name: 'MD',
          value: 19118,
        },
        {
          name: 'CD',
          value: 22026,
        },
      ],
    },
    {
      name: 'vis',
      color: '#E370B3',
      children: [
        {
          name: 'SD',
          value: 1000,
        },
        {
          name: 'MD',
          value: 30000,
        },
        {
          name: 'CD',
          value: 30000,
        },
        {
          name: 'AD',
          value: 20000,
        },
      ],
    },
  ],
};

const ChartComponent = () => {
  return (
    <ChartWrapper
      chartTitle="Sunburst Chart"
      directoryPath="/src/app/charts/pie-charts/sunburst-chart"
    >
      <ChartUtil data={data} />
    </ChartWrapper>
  );
}

export default ChartComponent