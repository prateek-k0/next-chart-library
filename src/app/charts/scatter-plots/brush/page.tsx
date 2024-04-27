import React from "react";
import ChartWrapper from "@/components/common/ChartWrapper";
import ChartUtil from "./ChartUtil";

const ChartComponent = async () => {
  // for large data sets, promisify
  const data = await Promise.resolve(
    import("./data.json")
      .then((res) => JSON.stringify(res))
      .then((res) => JSON.parse(res))
  );
  return (
    <ChartWrapper
      chartTitle="Scatter Plot - with Brush"
      directoryPath="/src/app/charts/scatter-plots/brush"
    >
      <ChartUtil data={data} />
    </ChartWrapper>
  );
};

export default ChartComponent;
