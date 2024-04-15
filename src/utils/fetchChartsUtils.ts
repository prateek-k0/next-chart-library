import { PathLike } from 'fs';
import fs from 'fs/promises';
import React from 'react';

export const fileTypeTester = new RegExp(/[^\s]+(.*?).(ts|tsx|js|jsx|scss|css)$/);

export interface ChartDataType { chartType: string, charts: string[] };

export const fetchAllCharts = React.cache(
  async () => {
    console.log('-------------------------- fetchAllCharts fn run --------------------------');
    const chartTypes = await fs.readdir('src/components/charts');
    const allCharts: ChartDataType[] = [];
    for(const chartType of chartTypes) {
      const dirCharts = await fs.readdir(`src/components/charts/${chartType}`);
      allCharts.push({
        chartType,
        charts: dirCharts
      });
    }
    return allCharts
  }
)

export const fetchChartsFromDirectory = async(dir: string, tester: RegExp = fileTypeTester) => {
  return (await fs.readdir(dir as PathLike)).filter((fileName) => fileTypeTester.test(fileName));
}

export const fetchChartText = async(filePath: string) => {
  return await fs.readFile(filePath).then(res => res.toString())
}