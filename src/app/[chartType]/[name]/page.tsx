import dynamic from "next/dynamic";
import React from "react";
import { ChartDataType, fetchAllCharts } from "@/utils/fetchChartsUtils";

interface PageParams {
  params: {
    chartType: string;
    name: string;
  };
}

// commented out, since SSG was causing fetchAllCharts() to run multiple times in build
// export const generateStaticParams = async () => {
//   const chartData: ChartDataType[] = await fetchAllCharts();
//   const allCharts = chartData.map((chartGroup) => chartGroup.charts.map(chart => ({ params: { chartType: chartGroup.chartType, name: chart }})));
//   console.log(allCharts);
//   return allCharts.flat(1);
// }

const GraphComponentPage = async ({ params }: PageParams) => {  
  const { chartType, name } = params;
  const ChartComponent = dynamic(
    () => import(`/public/charts/${chartType}/${name}/ChartComponent`),
    { ssr: false }  // no ssr for chart components: render directly on client
  );
  return (
    <div>
      <ChartComponent />
    </div>
  );
};

export default GraphComponentPage;
