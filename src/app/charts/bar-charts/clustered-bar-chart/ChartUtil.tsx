"use client";
import React, { useRef, useCallback, useEffect } from "react";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import * as d3 from "d3";
import { ChartProps } from "@/types";

const ChartUtil = ({ data }: ChartProps) => {
  const configRef = useRef({
    groupKey: "Contracts",
    keys: ["v1", "v2", "v3"],
    yAxisName: "% Utillisation",
    borderColorData: ["#c00000", "#e37f07", "#00b050"],
    barColorData: ["#ea3737", "#eabe37", "#9dc96f"],
    selector: "c-group-contracts-bar-chart-section",
    margin: {
      top: 50,
      bottom: 10,
      left: 40,
      right: 1,
    },
    svg: d3.select(null).select("svg") as d3.Selection<
      SVGSVGElement,
      unknown,
      null,
      undefined
    >,
    graph: d3.select(null).select("g") as d3.Selection<
      SVGGElement,
      unknown,
      null,
      undefined
    >,
    width: 0,
    height: 0,
  });

  const color_codes = useCallback(() => {
    return d3
      .scaleOrdinal()
      .domain(configRef.current.keys)
      .range(configRef.current.barColorData);
  }, []);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const renderSVG = useCallback(() => {
    const container = containerRef.current as HTMLDivElement | null;
    if (!container) return;
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
      (d3.select(container).node() as HTMLElement).clientWidth -
      configRef.current.margin.left -
      configRef.current.margin.right;

    configRef.current.graph = configRef.current.svg
      .append("g")
      .attr(
        "transform",
        `translate(${configRef.current.margin.left},${
          configRef.current.margin.top / 2
        })`
      );
  }, []);

  const x3 = useCallback(() => {
    return d3
      .scaleBand()
      .domain(data.map((d: any) => d[configRef.current.groupKey]))
      .rangeRound([0, configRef.current.width]);
  }, [data]);

  const x4 = useCallback(() => {
    return d3
      .scaleBand()
      .domain(configRef.current.keys)
      .rangeRound([20, x3().bandwidth()])
      .padding(0.2);
  }, [x3]);

  const yScale = useCallback(() => {
    const domainMax =
      d3.max(
        data,
        (d: any) =>
          d3.max(configRef.current.keys, (key) => d[key] as number) ?? 0
      ) ?? 0;
    return d3
      .scaleLinear()
      .domain([0, domainMax])
      .rangeRound([configRef.current.height, 0])
      .nice();
  }, [data]);

  const renderXAxis = useCallback(() => {
    configRef.current.graph
      .append("g")
      .attr("class", "x-axis")
      .style("font-family", "Space Mono")
      .style("font-size", "12px")
      .attr("transform", `translate(0,${configRef.current.height})`)
      .call(d3.axisBottom(x3()));
  }, [x3]);

  const renderYAxis = useCallback(() => {
    configRef.current.graph
      .append("g")
      .attr("class", "y-axis")
      .style("font-family", "Space Mono")
      .style("font-size", "12px")
      .call(d3.axisLeft(yScale()).ticks(null, "s"));
  }, [yScale]);

  const renderBars = useCallback(() => {
    configRef.current.graph
      .append("g")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "bar")
      .attr(
        "transform",
        (d: any) =>
          `translate(${(x3()(d[configRef.current.groupKey]) ?? 0) - 10},0)`
      )
      .selectAll("rect")
      .data((d: any) =>
        configRef.current.keys.map((key) => ({ key, value: d[key] }))
      )
      .enter()
      .append("rect")
      .attr("x", (d) => x4()(d.key) ?? 0 - x4().bandwidth())
      .attr("y", (d) => yScale()(d.value))
      .attr("width", x4().bandwidth())
      .attr("height", (d) => configRef.current.height - yScale()(d.value))
      .attr("fill", (d: any) => {
        d.color = color_codes()(d.key);
        return d.color;
      });
  }, [x3, x4, yScale, color_codes, data]);

  const renderGraph = useCallback(() => {
    const container = containerRef.current as HTMLDivElement | null;
    if (!container) return;
    renderSVG();
    renderXAxis();
    renderYAxis();
    renderBars();
  }, [renderSVG, renderXAxis, renderYAxis, renderBars]);

  useEffect(() => {
    containerRef.current !== null && renderGraph();
  }, [renderGraph]);

  const resizeHandler = useCallback(() => {
    containerRef.current !== null && renderGraph();
  }, [renderGraph]);

  useResizeObserver(containerRef, resizeHandler);

  return <div ref={containerRef}></div>;
};

export default ChartUtil;
