"use client";
import { ChartProps } from "@/types";
import React, { useRef, useCallback, useEffect } from "react";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import * as d3 from "d3";

const ChartUtil = ({ data }: ChartProps) => {
  const configRef = useRef({
    svg: d3.select(null).select("svg") as d3.Selection<
      SVGSVGElement,
      unknown,
      null,
      undefined
    >,
    margin: {
      top: 50,
      bottom: 0,
      left: 0,
      right: 50,
    },
    height: 0,
    width: 0,
    paddingLeft: 40,
    paddingTop: 10,
    keys: ["Defect", "Flag", "Good"],
    colors: [["#ffffffee", "#ffffffaa", "grey"]],
    selector: "bar-graph-stacked-section",
  });

  const stacks = useCallback(
    () => d3.stack().keys(configRef.current.keys)(data),
    [data]
  );

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
  }, []);

  const xScale = useCallback(
    () =>
      d3
        .scaleBand()
        .domain(stacks()[0].map((d: any) => d.data.month))
        .rangeRound([0, configRef.current.width]),
    [stacks]
  );

  const yScale = useCallback(() => {
    const max = d3.max(stacks()[stacks().length - 1], (d) => d[0] + d[1]) || 0;
    return d3
      .scaleLinear()
      .domain([0, max])
      .rangeRound([configRef.current.height, 0])
      .nice();
  }, [stacks]);

  const renderXAxis = useCallback(() => {
    const xAxis = d3.axisBottom(xScale());
    configRef.current.svg
      .append("g")
      .attr("class", "axis axis--x")
      .attr(
        "transform",
        `translate(${configRef.current.paddingLeft},${
          configRef.current.height + configRef.current.paddingTop
        })`
      )
      .call(xAxis)
      .call((d) => {
        d.selectAll("text")
          .attr("font-family", "Space Mono")
          .attr("font-size", "12px");
      });
  }, [xScale]);

  const renderYAxis = useCallback(() => {
    const yAxis = d3.axisLeft(yScale()).ticks(Math.ceil(data.length));
    configRef.current.svg
      .append("g")
      .attr("class", "axis axis--y")
      .attr(
        "transform",
        `translate(${configRef.current.paddingLeft},${configRef.current.paddingTop})`
      )
      .call(yAxis)
      .call((d) => {
        d.selectAll("text")
          .attr("font-family", "Space Mono")
          .attr("font-size", "12px");
      });
  }, [yScale, data]);

  const renderStacks = useCallback(() => {
    const layer = configRef.current.svg
      .selectAll(".layer")
      .data(stacks())
      .join("g")
      .attr("class", "layer")
      .style("fill", (d, i) => configRef.current.colors[0][i]);

    layer
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr(
        "x",
        (d: any) =>
          (xScale()(d.data.month) ?? 0) +
          xScale().bandwidth() / 4 +
          configRef.current.paddingLeft
      )
      .attr(
        "y",
        (d: any) => yScale()(d[0] + d[1]) + configRef.current.paddingTop
      )
      .attr("height", (d) => yScale()(d[0]) - yScale()(d[1] + d[0]))
      .attr("width", xScale().bandwidth() / 2);
  }, [stacks, xScale, yScale]);

  const renderGraph = useCallback(() => {
    const container = containerRef.current as HTMLDivElement | null;
    if (!container) return;
    renderSVG();
    renderXAxis();
    renderYAxis();
    renderStacks();
  }, [renderSVG, renderXAxis, renderYAxis, renderStacks]);

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
