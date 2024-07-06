"use client";
// reference: https://d3-graph-gallery.com/graph/line_basic.html
import React, { useEffect, useCallback, useRef } from "react";
import * as d3 from "d3";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { ChartProps } from "@/types";

const ChartUtil = ({ data: rawData }: ChartProps) => {
  const data = Object.values(rawData).filter((n: any) => n.value !== undefined);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const renderFunc = useCallback(async () => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;

    const margin = { top: 10, right: 10, bottom: 30, left: 70 },
      width = container.offsetWidth - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

    const svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const viewData = data.map((d: any) => ({
      date: d3.timeParse("%Y-%m-%d")(d.date),
      value: d.value,
    }));

    const x = d3
      .scaleTime()
      .domain(
        d3.extent(viewData, function (d) {
          return d.date;
        }) as any
      )
      .range([0, width]);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .call((d) =>
        d
          .selectAll("text")
          .attr("font-family", "Space Mono")
          .attr("font-size", "14px")
      );

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(viewData, function (d) {
          return +d.value;
        }) ?? 0,
      ])
      .range([height, 0]);
    svg
      .append("g")
      .call(d3.axisLeft(y).tickSizeOuter(0))
      .call((d) =>
        d
          .selectAll("text")
          .attr("font-family", "Space Mono")
          .attr("font-size", "14px")
      );

    svg
      .append("path")
      .datum(viewData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .x(function (d: any) {
            return x(d.date);
          })
          .y(function (d: any) {
            return y(d.value);
          }) as any
      );
  }, [data]);
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
