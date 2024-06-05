import React from "react";
import ChartWrapper from "@/components/common/ChartWrapper";
import ChartUtil from "./ChartUtil";

const data = [
  {
    focusGroup: "Iaas",
    values: [36, 20, 38],
  },
  {
    focusGroup: "Paas",
    values: [56, 40, 68],
  },
  {
    focusGroup: "App Dev",
    values: [46, 48, 52],
  },
  {
    focusGroup: "App Support",
    values: [20, 25, 30],
  },
  {
    focusGroup: "Commute",
    values: [96, 84, 128],
  },
  {
    focusGroup: "Network",
    values: [46, 70, 52],
  },
  {
    focusGroup: "Storage",
    values: [46, 24, 72],
  },
  {
    focusGroup: "On prem",
    values: [30, 60, 90],
  },
  {
    focusGroup: "Saas",
    values: [68, 60, 74],
  },
];

const ChartComponent = async () => {
  return (
    <ChartWrapper chartTitle="3D Area Chart" directoryPath="/src/app/charts/3D/area-chart">
      <ChartUtil data={data} />
    </ChartWrapper>
  );
};

export default ChartComponent;
