"use client";
// reference: https://d3-graph-gallery.com/graph/bubble_tooltip.htmlp
import { ChartProps } from "@/types";
import React, { useEffect, useCallback, useRef } from "react";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import * as d3 from "d3";

const ChartUtil = ({ data }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const renderFunc = useCallback(async () => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;

    const margin = { top: 25, right: 25, bottom: 25, left: 25 },
      width = container.offsetWidth - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, 16000]).range([0, width]);
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

    const y = d3.scaleLinear().domain([35, 90]).range([height, 0]);
    svg
      .append("g")
      .call(d3.axisLeft(y))
      .call((d) =>
        d
          .selectAll("text")
          .attr("font-family", "Space Mono")
          .attr("font-size", "12px")
      );

    const z = d3.scaleLinear().domain([200000, 1310000000]).range([4, 40]);

    const myColor = d3
      .scaleOrdinal()
      .domain(["Asia", "Europe", "Americas", "Africa", "Oceania"])
      .range(d3.schemeSet2);

    const tooltip = d3
      .select(container)
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "#fff")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "#000");

    const showTooltip = function (event: any, d: any) {
      tooltip.transition().duration(200);
      tooltip
        .style("opacity", 1)
        .html("Country: " + d.country)
        .style(
          "left",
          event.x - (tooltip.node() as HTMLElement).clientWidth / 2 + "px"
        )
        .style("top", event.y + 20 + "px")
        .style("position", "absolute");
      d3.select(event.target).attr("stroke", "#fff");
    };
    const moveTooltip = function (event: any) {
      tooltip
        .style(
          "left",
          event.x - (tooltip.node() as HTMLElement).clientWidth / 2 + "px"
        )
        .style("top", event.y + 20 + "px");
      d3.select(event.target).attr("stroke", "#fff");
    };
    const hideTooltip = function (event: any) {
      tooltip.transition().duration(200).style("opacity", 0);
      d3.select(event.target).attr("stroke", "#000");
    };

    svg
      .append("g")
      .selectAll("dot")
      .data(data)
      .join("circle")
      .attr("class", "bubbles")
      .attr("cx", (d: any) => x(d.gdpPercap))
      .attr("cy", (d: any) => y(d.lifeExp))
      .attr("r", (d: any) => z(d.pop))
      .attr("stroke", "#000")
      .attr("stroke-width", 2)
      .attr("fill", (d: any) => myColor(d.continent) as string)
      // -3- Trigger the functions
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip);
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
