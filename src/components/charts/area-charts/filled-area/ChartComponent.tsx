import ChartWrapper from "@/components/common/ChartWrapper";
import ChartUtil from "./ChartUtil";

const data = [
  {
    Xvalue: 'Jan\'22',
    cat: '1000',
  },
  {
    Xvalue: 'Feb\'22',
    cat: '800',
  },
  {
    Xvalue: 'Mar\'22',
    cat: '1600',
  },
  {
    Xvalue: 'Apr\'22',
    cat: '1200',
  },
];

const ChartComponent = () => {
  return (
    <ChartWrapper
      chartTitle="Filled Area Chart"
      directoryPath="./src/components/charts/area-charts/filled-area"
    >
      <ChartUtil data={data} />
    </ChartWrapper>
  );
};

export default ChartComponent;
