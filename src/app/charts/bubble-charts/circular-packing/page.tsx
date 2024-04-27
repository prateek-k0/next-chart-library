import ChartWrapper from "@/components/common/ChartWrapper";
import ChartUtil from "./ChartUtil";

const data = {
  report: "",
  color: "#fff",
  children: [
    {
      report: "Test Report-1",
      value: 50,
      color: "#e8e6eb",
      children: [
        {
          report: "Highly Similar",
          value: 10,
          color: "rgb(163, 222, 247)",
        },
        {
          report: "Duplicate",
          value: 20,
          color: "rgb(100, 151, 249)",
        },
        {
          report: "Subset",
          value: 20,
          color: "rgb(114, 189, 250)",
        },
      ],
    },
    {
      report: "Test Report-2",
      value: 45,
      color: "#e8e6eb",
      children: [
        {
          report: "Subset",
          value: 5,
          color: "rgb(114, 189, 250)",
        },
        {
          report: "Highly Similar",
          value: 10,
          color: "rgb(163, 222, 247)",
        },
        {
          report: "Duplicate",
          value: 30,
          color: "rgb(100, 151, 249)",
        },
      ],
    },
    {
      report: "Test Report-3",
      value: 60,
      color: "#e8e6eb",
      children: [
        {
          report: "Subset",
          value: 10,
          color: "rgb(114, 189, 250)",
        },
        {
          report: "Highly Similar",
          value: 20,
          color: "rgb(163, 222, 247)",
        },
        {
          report: "Duplicate",
          value: 30,
          color: "rgb(100, 151, 249)",
        },
      ],
    },
  ],
};

const ChartComponent = async () => {
  return (
    <ChartWrapper
      chartTitle="Circular Packing"
      directoryPath="/src/app/charts/bubble-charts/circular-packing"
    >
      <ChartUtil data={data} />
    </ChartWrapper>
  );
};

export default ChartComponent;
