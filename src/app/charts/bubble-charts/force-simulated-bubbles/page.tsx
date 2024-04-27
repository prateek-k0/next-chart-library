import ChartWrapper from "@/components/common/ChartWrapper";
import ChartUtil from "./ChartUtil";
import { data } from "./data";

const ChartComponent = async () => {
  return (
    <ChartWrapper
      chartTitle="Force Simulated Bubbles"
      directoryPath="/src/app/charts/bubble-charts/force-simulated-bubbles"
    >
      <ChartUtil data={data} />
    </ChartWrapper>
  );
};

export default ChartComponent;
