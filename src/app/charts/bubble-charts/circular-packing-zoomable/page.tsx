import ChartWrapper from "@/components/common/ChartWrapper";
import ChartUtil from "./ChartUtil";
import { data } from "./data";

const ChartComponent = async () => {
  return (
    <ChartWrapper
      chartTitle="Circular Packing - Zoomable"
      directoryPath="/src/app/charts/bubble-charts/circular-packing-zoomable"
    >
      <ChartUtil data={data} />
    </ChartWrapper>
  );
};

export default ChartComponent;
