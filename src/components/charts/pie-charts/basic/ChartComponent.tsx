import React from "react";
import ChartWrapper from "@/components/common/ChartWrapper";
import ChartUtil from "./ChartUtil";

const data = [
  {
    label: "Category 1",
    value: 40,
    color: "#60607F",
    radius: 16,
  },
  {
    label: "Category 2",
    value: 20,
    color: "#6D6ACC",
    radius: 12,
  },
  {
    label: "Category 3",
    value: 15,
    color: "#9657D5",
    radius: 8,
  },
  {
    label: "Category 4",
    value: 15,
    color: "#DC67CE",
    radius: 4,
  },
  {
    label: "Category 5",
    value: 10,
    color: "#E4E4E4",
    radius: 0,
  },
];

const ChartComponent = () => {
  return (
    <ChartWrapper
      chartTitle="Basic Pie Chart"
      directoryPath="./src/components/charts/pie-charts/basic"
    >
      <ChartUtil data={data} />
    </ChartWrapper>
  );
};

export default ChartComponent;
