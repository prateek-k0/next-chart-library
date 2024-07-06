"use client";
// reference: https://d3-graph-gallery.com/graph/histogram_basic.html
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

    const margin = { top: 25, right: 25, bottom: 25, left: 50 },
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

    const x = d3
      .scaleLinear()
      .domain([0, 1000]) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, width]);
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
        return d.price;
      }) // I need to give the vector of value
      .domain([0, 1000]) // then the domain of the graphic
      .thresholds(x.ticks(70)); // then the numbers of bins

    // And apply this function to data to get the bins
    const bins = histogram(data);

    const y = d3.scaleLinear().range([height, 0]);
    y.domain([
      0,
      d3.max(bins, function (d) {
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

    // append the bar rectangles to the svg element
    svg
      .selectAll("rect")
      .data(bins)
      .join("rect")
      .attr("x", 1)
      .attr("transform", function (d: any) {
        return `translate(${x(d.x0)} , ${y(d.length)})`;
      })
      .attr("width", function (d: any) {
        return x(d.x1) - x(d.x0);
      })
      .attr("height", function (d) {
        return height - y(d.length);
      })
      .style("fill", "#69b3a2");
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
