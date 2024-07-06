"use client"
// reference: https://d3-graph-gallery.com/graph/histogram_double.html 
import React, { useEffect, useCallback, useRef } from "react";
import * as d3 from "d3";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { ChartProps } from "@/types";

const ChartUtil = ({ data: rawData }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const data: any[] = Object.values(rawData);

  const renderFunc = useCallback(async () => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;

    const margin = { top: 25, right: 10, bottom: 25, left: 50 },
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

    const x = d3.scaleLinear().domain([-4, 9]).range([0, width]);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .call((d) =>
        d
          .selectAll("text")
          .attr("font-family", "Space Mono")
          .attr("font-size", "12px")
      );

    const histogram = d3
      .histogram()
      .value(function (d: any) {
        return +d.value;
      }) // I need to give the vector of value
      .domain([-4, 9]) // then the domain of the graphic
      .thresholds(x.ticks(40)); // then the numbers of bins

    // And apply twice this function to data to get the bins.
    const bins1 = histogram(
      data.filter(function (d: any) {
        return d.type === "variable 1";
      })
    );
    const bins2 = histogram(
      data.filter(function (d: any) {
        return d.type === "variable 2";
      })
    );

    const y = d3.scaleLinear().range([height, 0]);
    y.domain([
      0,
      d3.max(bins1, function (d) {
        return d.length;
      }) ?? 0,
    ]); // d3.hist has to be called before the Y axis obviously
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
      .selectAll("rect")
      .data(bins1)
      .join("rect")
      .attr("x", 1)
      .attr("transform", function (d: any) {
        return `translate(${x(d.x0)} , ${y(d.length)})`;
      })
      .attr("width", function (d: any) {
        return Math.max(x(d.x1) - x(d.x0) - 1, 0);
      })
      .attr("height", function (d: any) {
        return height - y(d.length);
      })
      .style("fill", "#69b3a2")
      .style("opacity", 0.8);

    svg
      .selectAll("rect2")
      .data(bins2)
      .enter()
      .append("rect")
      .attr("x", 1)
      .attr("transform", function (d: any) {
        return `translate(${x(d.x0)}, ${y(d.length)})`;
      })
      .attr("width", function (d: any) {
        return Math.max(x(d.x1) - x(d.x0) - 1, 0);
      })
      .attr("height", function (d: any) {
        return height - y(d.length);
      })
      .style("fill", "#4060aa")
      .style("opacity", 0.8);
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
