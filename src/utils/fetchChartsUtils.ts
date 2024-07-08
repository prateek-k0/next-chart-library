import { PathLike } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import React from 'react';

export const fileTypeTester = new RegExp(/[^\s]+(.*?).(ts|tsx|js|jsx|scss|css)$/);

export interface ChartDataType { chartType: string, charts: string[] };

export const fetchChartLinks = React.cache(
  async () => {
    console.log('-------------------------- fetchChartLinks fn run --------------------------');
    console.log('cwd at fetchChartLinks ----------->', process.cwd());
    const chartTypes = await fs.readdir(path.join(process.cwd(), '/src/app/charts'));
    const allCharts: ChartDataType[] = [];
    for(const chartType of chartTypes) {
      const dirCharts = await fs.readdir(path.join(process.cwd(), `/src/app/charts/${chartType}`));
      allCharts.push({
        chartType,
        charts: dirCharts
      });
    }
    return allCharts
  }
)

export const fetchChartsFromDirectory = React.cache(async(dir: string, tester: RegExp = fileTypeTester) => {
  return (await fs.readdir(path.join(process.cwd(), dir))).filter((fileName) => tester.test(fileName));
})

export const fetchChartText = React.cache(async(filePath: string) => {
  return await fs.readFile(path.join(process.cwd(), filePath)).then(res => res.toString())
})
