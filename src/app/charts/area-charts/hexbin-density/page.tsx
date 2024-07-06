import ChartWrapper from "@/components/common/ChartWrapper";
import ChartUtil from "./ChartUtil";

const ChartComponent = async () => {
  // for large data sets, promisify
  const dataFetch = await Promise.resolve(
    import("./data.json")
      .then((res) => JSON.stringify(res))
      .then((res) => JSON.parse(res))
  );
  return (
    <ChartWrapper
      chartTitle="Hexbin Density"
      directoryPath="/src/app/charts/area-charts/hexbin-density"
    >
      <ChartUtil data={dataFetch} />
    </ChartWrapper>
  );
};

export default ChartComponent;
