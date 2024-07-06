"use client";
// reference: https://d3-graph-gallery.com/graph/scatter_animation_start.html
import React, { useEffect, useCallback, useRef } from "react";
import * as d3 from "d3";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { ChartProps } from "@/types";

const ChartUtil = ({ data: rawData }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const data: any[] = Object.values(rawData);
  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;

    const margin = { top: 50, right: 25, bottom: 25, left: 75 },
      width = container.offsetWidth - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;
    // append the svg object to the body of the page
    const svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleLinear().domain([0, 0]).range([0, 0]);
    svg
      .append("g")
      .attr("class", "myXaxis")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .call((d) =>
        d
          .selectAll("text")
          .attr("font-family", "Space Mono")
          .attr("font-size", "12px")
      )
      .attr("opacity", "0");

    const y = d3.scaleLinear().domain([0, 500000]).range([height, 0]);
    svg
      .append("g")
      .call(d3.axisLeft(y))
      .call((d) =>
        d
          .selectAll("text")
          .attr("font-family", "Space Mono")
          .attr("font-size", "12px")
      );

    svg
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return x(d.GrLivArea);
      })
      .attr("cy", function (d) {
        return y(d.SalePrice);
      })
      .attr("r", 2)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .style("fill", "magenta")
      .on("mouseover", (event, d) => {
        d3.select(event.target).raise().attr("r", "8").attr("stroke-width", 2);
      })
      .on("mouseleave", (event, d) => {
        d3.select(event.target).attr("r", "4").attr("stroke-width", 1);
      });

    // new X axis
    x.domain([0, 6000]).range([0, width]);
    svg
      .select(".myXaxis")
      .transition()
      .duration(1500)
      .attr("opacity", "1")
      .call(d3.axisBottom(x) as any)
      .call((d) =>
        d
          .selectAll("text")
          .attr("font-family", "Space Mono")
          .attr("font-size", "12px")
      );

    svg
      .selectAll("circle")
      .transition()
      .delay(function (d, i) {
        return i * 1.5;
      })
      .duration(1500)
      .attr("cx", function (d: any) {
        return x(d.GrLivArea);
      })
      .attr("cy", function (d: any) {
        return y(d.SalePrice);
      })
      .attr("r", 4)
      .style("fill", "#02b4fa");
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
