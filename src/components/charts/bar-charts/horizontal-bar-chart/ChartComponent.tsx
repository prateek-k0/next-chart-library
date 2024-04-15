import ChartWrapper from "@/components/common/ChartWrapper";
import React from "react";
import ChartUtil from "./ChartUtil";

const data = [
  {
    vertical: "Agile Progress",
    value: "-10.0",
    type: "B",
  },
  {
    vertical: "Agile Progress",
    value: "-80.0",
    type: "B",
  },
  {
    vertical: "Agile Progress",
    value: "50.0",
    type: "A",
  },
  {
    vertical: "Agile Progress",
    value: "90.0",
    type: "A",
  },
  {
    vertical: "Test",
    value: "100",
    type: "A",
  },
  {
    vertical: "Test",
    value: "-110",
    type: "B",
  },
  {
    vertical: "DevOps",
    value: "90",
    type: "A",
  },
  {
    vertical: "DevOps",
    value: "-110",
    type: "B",
  },
  {
    vertical: "AD",
    value: "100",
    type: "A",
  },
  {
    vertical: "AD",
    value: "-110",
    type: "B",
  },
  {
    vertical: "AM",
    value: "90",
    type: "A",
  },
  {
    vertical: "AM",
    value: "-110",
    type: "B",
  },
  {
    vertical: "Agile",
    value: "-110",
    type: "B",
  },
  {
    vertical: "Agile",
    value: "90",
    type: "A",
  },
  {
    vertical: "Agile",
    value: "-110",
    type: "B",
  },
];

const ChartComponent = () => {
  return (
    <ChartWrapper
      chartTitle="Horizontal Bar Chart"
      directoryPath="./src/components/charts/bar-charts/horizontal-bar-chart"
    >
      <ChartUtil data={data} />
    </ChartWrapper>
  );
};

export default ChartComponent;
