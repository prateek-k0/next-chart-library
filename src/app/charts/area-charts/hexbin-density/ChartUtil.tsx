"use client";
// reference: https://d3-graph-gallery.com/graph/density2d_hexbin.html
import { ChartProps } from "@/types";
import React, { useRef, useCallback, useEffect } from "react";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import * as d3 from "d3";
// @ts-ignore
import * as d3Hexbin from "d3-hexbin";

const ChartUtil = ({ data: rawData }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const data = Object.values(rawData);
  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;
    const margin = { top: 50, right: 25, bottom: 25, left: 25 },
      width = container.offsetWidth - margin.left - margin.right,
      height = 640 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add X axis
    const x = d3.scaleLinear().domain([5, 18]).range([0, width]);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .call((d) =>
        d
          .selectAll("text")
          .attr("font-family", "Space Mono")
          .attr("font-size", 14)
      );

    // Add Y axis
    const y = d3.scaleLinear().domain([5, 20]).range([height, 0]);
    svg
      .append("g")
      .call(d3.axisLeft(y))
      .call((d) =>
        d
          .selectAll("text")
          .attr("font-family", "Space Mono")
          .attr("font-size", 14)
      );

    // Reformat the data: d3-hexbin() needs a specific format
    const inputForHexbinFun: any[] = [];
    data.forEach(function (d: any) {
      inputForHexbinFun.push([x(d.x), y(d.y)]); // Note that we had the transform value of X and Y !
    });

    // Prepare a color palette
    const color = d3
      .scaleLinear<string, number>()
      .domain([0, 250]) // Number of points in the bin?
      .range(["transparent", "#038aff"]);

    // Compute the hexbin data
    const hexbin = d3Hexbin
      .hexbin()
      .radius(9) // size of the bin in px
      .extent([
        [0, 0],
        [width, height],
      ]);

    // Plot the hexbins
    svg
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);

    svg
      .append("g")
      .attr("clip-path", "url(#clip)")
      .selectAll("path")
      .data(hexbin(inputForHexbinFun))
      .join("path")
      .attr("d", hexbin.hexagon())
      .attr("transform", function (d: any) {
        return `translate(${d.x}, ${d.y})`;
      })
      .attr("fill", function (d: any) {
        return color(d.length);
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", "0.1");
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
