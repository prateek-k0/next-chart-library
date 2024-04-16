"use client";
import { ChartProps } from "@/types";
import React, { useRef, useCallback, useEffect } from "react";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import * as d3 from "d3";

const ChartUtil = ({ data }: ChartProps) => {
  const configRef = useRef({
    lineWidth: 0.1,
    gridWidth: 0.3,
    width: 0,
    height: 0,
    margin: {
      top: 50,
      bottom: 20,
      left: 25,
      right: 25,
    },
    keys: ["Defect", "Flag", "Good"],
    color: ["royalblue", "dodgerblue", "skyblue"],
    selector: "area-chart-section",
    svg: undefined as any,
    chart: undefined as any,
    pulledData: undefined as any,
    stackedData: [] as any[],
    colorScale: undefined as any,
    areaGenerator: undefined as any,
  });

  const containerRef = useRef<HTMLDivElement | null>(null);

  const renderSVG = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!containerRef.current) return;
    const contHeight = 640;
    configRef.current.height =
      contHeight -
      configRef.current.margin.top -
      configRef.current.margin.bottom;
    configRef.current.svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("class", configRef.current.selector)
      .attr(
        "height",
        configRef.current.height +
          configRef.current.margin.top +
          configRef.current.margin.bottom
      )
      .attr("width", "100%");
    configRef.current.width =
      container.offsetWidth -
      configRef.current.margin.left -
      configRef.current.margin.right;
  }, []);

  const renderChart = useCallback(() => {
    configRef.current.chart = configRef.current.svg
      .append("g")
      .attr(
        "transform",
        `translate(${configRef.current.margin.left}, ${configRef.current.margin.top})`
      );
  }, []);

  const prepareData = useCallback(() => {
    configRef.current.stackedData = [];
    const stack = d3.stack().keys(configRef.current.keys);
    configRef.current.pulledData = stack(data);
    configRef.current.pulledData.forEach((layer: any[]) => {
      const currentStack: any[] = [];
      layer.forEach((d, i) => {
        currentStack.push({ value: d, month: data[i].month });
      });
      configRef.current.stackedData.push(currentStack);
    });
  }, [data]);

  const generateColors = useCallback(() => {
    configRef.current.colorScale = d3
      .scaleOrdinal()
      .domain(configRef.current.keys)
      .range(configRef.current.color);
  }, []);

  const xScale = useCallback(() => {
    return d3
      .scalePoint()
      .range([0, configRef.current.width])
      .domain(data.map((s: any) => s.month));
  }, [data]);

  const drawVerticalLines = useCallback(() => {
    configRef.current.chart
      .append("g")
      .attr("class", "grid")
      .call(d3.axisBottom(xScale()).tickSize(configRef.current.height))
      .attr("stroke-width", configRef.current.gridWidth)
      .call((d: any) => {
        d.selectAll("text").remove();
      });
  }, [xScale]);

  const yScale = useCallback(() => {
    const domainY =
      d3.max(
        configRef.current.pulledData[configRef.current.pulledData.length - 1],
        (dp: any[]) => dp[1] as number
      ) ?? 0;
    return d3
      .scaleLinear()
      .range([configRef.current.height, 0])
      .domain([0, domainY])
      .nice();
  }, []);

  const drawHorizontalLines = useCallback(() => {
    configRef.current.chart
      .append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale()).tickSize(-configRef.current.width))
      .attr("stroke-width", configRef.current.gridWidth)
      .call((d: any) => {
        d.selectAll("text").remove();
      });
  }, [yScale]);

  const drawXAxis = useCallback(() => {
    configRef.current.chart
      .append("g")
      .attr("transform", `translate(0, ${configRef.current.height})`)
      .attr("class", "axis axis--x")
      .call(
        d3.axisBottom(xScale()).ticks(data.length).tickPadding(6).tickSize(0)
      )
      .call((d: any) => {
        d.selectAll("text")
          .attr("font-family", "Space Mono")
          .attr("font-weight", 400)
          .attr("font-size", "12px");
      });
  }, [data, xScale]);

  const drawYAxis = useCallback(() => {
    configRef.current.chart
      .append("g")
      .attr("transform", "translate(0, 0)")
      .call(d3.axisLeft(yScale()).ticks(4).tickSize(0))
      .call((d: any) => {
        d.selectAll("text")
          .attr("font-family", "Space Mono")
          .attr("font-weight", 400)
          .attr("font-size", "12px");
      });
  }, [yScale]);

  const drawArea = useCallback(() => {
    const areaGenerator = () => {
      return d3
        .area()
        .x((d: any) => xScale()(d.month) ?? 0)
        .y0((d: any) => yScale()(d.value[0]))
        .y1((d: any) => yScale()(d.value[1]));
    };

    configRef.current.chart
      .selectAll(".series")
      .data(configRef.current.stackedData)
      .enter()
      .append("g")
      .attr("class", "series")
      .attr("id", (d: any, i: number) =>
        configRef.current.colorScale(configRef.current.pulledData[i].key)
      )
      .append("path")
      .attr("fill", (d: any, i: number) =>
        configRef.current.colorScale(configRef.current.pulledData[i].key)
      )
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", configRef.current.lineWidth)
      .attr("d", (d: any) => areaGenerator()(d))
      .on("mouseover", (event: any) => {
        event.stopPropagation();
        const element = event.target;
        d3.selectAll("g.series").attr("opacity", 0.35);
        d3.select(element.parentNode).attr("opacity", 1);
      })
      .on("mouseleave", () => {
        d3.selectAll("g.series").attr("opacity", 1);
      });
  }, [xScale, yScale]);

  const renderFunc = useCallback(() => {
    if (!containerRef.current) return;
    prepareData();
    generateColors();
    renderSVG();
    renderChart();
    drawVerticalLines();
    drawHorizontalLines();
    drawXAxis();
    drawYAxis();
    drawArea();
  }, [
    prepareData,
    generateColors,
    renderSVG,
    renderChart,
    drawVerticalLines,
    drawHorizontalLines,
    drawXAxis,
    drawYAxis,
    drawArea,
  ]);

  useEffect(() => {
    containerRef.current !== null && renderFunc();
  }, [renderFunc]);

  const resizeHandler = useCallback(() => {
    containerRef.current !== null && renderFunc();
  }, [renderFunc]);

  useResizeObserver(containerRef, resizeHandler);

  return <div ref={containerRef}></div>;
};

export default ChartUtil;
