"use client";
import React, { useEffect, useCallback, useRef } from "react";
import * as d3 from "d3";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { ChartProps } from "@/types";

const ChartUtil = ({ data }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;

    const margin = { top: 0, right: 0, bottom: 0, left: 0 },
      width = container.offsetWidth - margin.left - margin.right,
      height = 640 - margin.top - margin.bottom;

    const svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const root = d3.hierarchy(data).sum(function (d) {
      return d.value;
    });

    d3
      .treemap()
      .size([width, height])
      .paddingTop(28)
      .paddingRight(7)
      .paddingInner(3)(root);

    const color = d3
      .scaleOrdinal()
      .domain(["boss1", "boss2", "boss3"])
      .range(["#973ef7", "#D18975", "#63b344"]);

    // And a opacity scale
    const opacity = d3.scaleLinear().domain([10, 30]).range([0.5, 1]);

    // use this information to add rectangles:
    svg
      .selectAll("rect")
      .data(root.leaves())
      .join("rect")
      .attr("x", function (d: any) {
        return d.x0;
      })
      .attr("y", function (d: any) {
        return d.y0;
      })
      .attr("width", function (d: any) {
        return d.x1 - d.x0;
      })
      .attr("height", function (d: any) {
        return d.y1 - d.y0;
      })
      .attr("rx", 4)
      .attr("ry", 4)
      .style("stroke", "black")
      .style("stroke-width", 0)
      .style("fill", function (d: any) {
        return color(d.parent.data.name) as string;
      })
      .style("opacity", function (d: any) {
        return opacity(d.data.value);
      });

    svg
      .selectAll("text")
      .data(root.leaves())
      .enter()
      .append("text")
      .attr("x", function (d: any) {
        return d.x0 + 5;
      })
      .attr("y", function (d: any) {
        return d.y0 + 20;
      })
      .text(function (d) {
        return d.data.name.replace("mister_", "");
      })
      .attr("font-size", "19px")
      .attr("fill", "white");

    svg
      .selectAll("vals")
      .data(root.leaves())
      .enter()
      .append("text")
      .attr("x", function (d: any) {
        return d.x0 + 5;
      })
      .attr("y", function (d: any) {
        return d.y0 + 35;
      })
      .text(function (d: any) {
        return d.data.value;
      })
      .attr("font-size", "11px")
      .attr("fill", "white");

    svg
      .selectAll("titles")
      .data(
        root.descendants().filter(function (d) {
          return d.depth === 1;
        })
      )
      .enter()
      .append("text")
      .attr("x", function (d: any) {
        return d.x0;
      })
      .attr("y", function (d: any) {
        return d.y0 + 21;
      })
      .text(function (d) {
        return d.data.name;
      })
      .attr("font-size", "19px")
      .attr("fill", function (d: any) {
        return color(d.data.name) as string;
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
