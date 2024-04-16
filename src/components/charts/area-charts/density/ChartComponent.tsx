import ChartWrapper from "@/components/common/ChartWrapper";
import ChartUtil from "./ChartUtil";

const data = [
  {
    Xvalue: "0",
    cat1: "0",
    cat2: "0",
    cat3: "0",
  },
  {
    Xvalue: "5",
    cat1: "5",
    cat2: "0",
    cat3: "0",
  },
  {
    Xvalue: "10",
    cat1: "28",
    cat2: "2",
    cat3: "0",
  },
  {
    Xvalue: "15",
    cat1: "10",
    cat2: "17",
    cat3: "0",
  },
  {
    Xvalue: "20",
    cat1: "5",
    cat2: "12",
    cat3: "1",
  },
  {
    Xvalue: "25",
    cat1: "0.5",
    cat2: "5",
    cat3: "6",
  },
  {
    Xvalue: "30",
    cat1: "0",
    cat2: "0.5",
    cat3: "13.5",
  },
  {
    Xvalue: "35",
    cat1: "0",
    cat2: "0",
    cat3: "21",
  },
  {
    Xvalue: "40",
    cat1: "0",
    cat2: "0",
    cat3: "3",
  },
  {
    Xvalue: "45",
    cat1: "0",
    cat2: "0",
    cat3: "0",
  },
];

const ChartComponent = () => {
  return (
    <ChartWrapper
      chartTitle="Area - Density"
      directoryPath="./src/components/charts/area-charts/density"
    >
      <ChartUtil data={data} />
    </ChartWrapper>
  );
};

export default ChartComponent;
