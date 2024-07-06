"use client";
// reference: https://d3-graph-gallery.com/graph/line_several_group.html
import React, { useEffect, useCallback, useRef } from "react";
import * as d3 from "d3";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { ChartProps } from "@/types";

const ChartUtil = ({ data: rawData }: ChartProps) => {
  const data = Object.values(rawData).filter((n: any) => n.prop !== undefined);
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

    const sumstat = d3.group(data, (d: any) => d.name);

    const x = d3
      .scaleLinear()
      .domain(
        d3.extent(data, function (d: any) {
          return d.year;
        }) as any
      )
      .range([0, width]);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(5))
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
        d3.max(data, function (d: any) {
          return +d.n;
        }) ?? 0,
      ])
      .range([height, 0]);
    svg
      .append("g")
      .call(d3.axisLeft(y))
      .call((d) =>
        d
          .selectAll("text")
          .attr("font-family", "Space Mono")
          .attr("font-size", "14px")
      );

    const color = d3
      .scaleOrdinal()
      .range([
        "#e41a1c",
        "#377eb8",
        "#4daf4a",
        "#984ea3",
        "#ff7f00",
        "#ffab03",
        "#a65628",
        "#f781bf",
        "#999999",
      ]);

    svg
      .selectAll(".line")
      .data(sumstat)
      .join("path")
      .attr("fill", "none")
      .attr("stroke", function (d: any) {
        return color(d[0]) as string;
      })
      .attr("stroke-width", 1.5)
      .attr("d", function (d) {
        return d3
          .line()
          .x(function (d: any) {
            return x(d.year);
          })
          .y(function (d: any) {
            return y(+d.n);
          })(d[1] as any);
      });
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
