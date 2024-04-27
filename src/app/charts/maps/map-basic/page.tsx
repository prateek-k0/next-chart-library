import ChartWrapper from "@/components/common/ChartWrapper";
import React from "react";
import ChartUtil from "./ChartUtil";

const ChartComponent = async () => {
  const mapData = await fetch(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  ).then((res) => res.json());
  return (
    <ChartWrapper
      chartTitle="Basic Map"
      directoryPath="/src/app/charts/maps/map-basic"
    >
      <ChartUtil data={mapData} />
    </ChartWrapper>
  );
};

export default ChartComponent;
