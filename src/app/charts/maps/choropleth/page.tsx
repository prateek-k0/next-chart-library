import React from "react";
import ChartUtil from "./ChartUtil";
import * as d3 from "d3";
import ChartWrapper from "@/components/common/ChartWrapper";

const ChartComponent = async () => {
  const geoData = await fetch(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  ).then((res) => res.json());
  const popData = await d3.csv(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv"
  );
  return (
    <ChartWrapper
      chartTitle="Choropleth Map"
      directoryPath="/src/app/charts/maps/choropleth"
    >
      <ChartUtil data={{ geoData, popData }} />
    </ChartWrapper>
  );
};

export default ChartComponent;
