import ChartWrapper from "@/components/common/ChartWrapper";
import ChartUtil from "./ChartUtil";

const data = [
  { country: "Peru", cases: 638 },
  { country: "Bulgaria", cases: 534 },
  { country: "Hungary", cases: 478 },
  { country: "Czechia", cases: 374 },
  { country: "Romania", cases: 342 },
  { country: "Brazil", cases: 310 },
  { country: "Poland", cases: 307 },
  { country: "Chile", cases: 299 },
  { country: "US", cases: 298 },
  { country: "Argentina", cases: 281 },
  { country: "Greece", cases: 278 },
  { country: "Colombia", cases: 273 },
  { country: "Italy", cases: 269 },
  { country: "Belgium", cases: 269 },
  { country: "Paraguay", cases: 260 },
  { country: "Ukraine", cases: 259 },
  { country: "UK", cases: 255 },
  { country: "Russia", cases: 252 },
  { country: "Mexico", cases: 249 },
  { country: "Tunisia", cases: 239 },
];

const ChartComponent = async () => {
  return (
    <ChartWrapper
      chartTitle="Dotted Bar Chart"
      directoryPath="./src/components/charts/bar-charts/dotted-bar-chart"
    >
      <ChartUtil data={data} />
    </ChartWrapper>
  );
};

export default ChartComponent;
