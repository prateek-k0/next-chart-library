import ChartWrapper from "@/components/common/ChartWrapper";
import ChartUtil from "./ChartUtil";
import data from "./data.json";

const ChartComponent = async () => {
  return (
    <ChartWrapper
      chartTitle="Ridge Line"
      directoryPath="./src/components/charts/area-charts/ridge-line"
    >
      <ChartUtil data={data} />
    </ChartWrapper>
  );
};

export default ChartComponent;
