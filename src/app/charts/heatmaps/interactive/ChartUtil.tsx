"use client";
import React, { useEffect, useCallback, useRef } from "react";
import * as d3 from "d3";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { ChartProps } from "@/types";

const ChartUtil = ({ data: rawData }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const data = Object.values(rawData);

  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;

    const margin = {top: 25, right: 0, bottom: 25, left: 25},
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

    const myGroups = Array.from(
      new Set(data.map((d: any) => d.group))
    ) as string[];
    const myVars = Array.from(
      new Set(data.map((d: any) => d.variable))
    ) as string[];

    // Build X scales and axis:
    const x = d3.scaleBand().range([0, width]).domain(myGroups).padding(0.05);
    svg
      .append("g")
      .style("font-size", 15)
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickSize(0))
      .select(".domain")
      .remove();

    // Build Y scales and axis:
    const y = d3.scaleBand().range([height, 0]).domain(myVars).padding(0.05);
    svg
      .append("g")
      .style("font-size", 15)
      .call(d3.axisLeft(y).tickSize(0))
      .select(".domain")
      .remove();

    // Build color scale
    const myColor = d3
      .scaleSequential()
      .interpolator(d3.interpolatePlasma)
      .domain([1, 100]);

    // create a tooltip
    const tooltip = d3
      .select(container)
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "#000")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .style("position", "absolute")
      .style("color", "#fff");

    const mouseover = function (this: any, event: any, d: any) {
      tooltip.style("opacity", 1);
      tooltip
        .html("The exact value of<br>this cell is: " + d.value)
        .style("left", event.x + "px")
        .style("top", event.y + 20 + "px");
      d3.select(this).style("stroke", "#fff").style("opacity", 1);
    };
    const mouseleave = function (this: any) {
      tooltip.style("opacity", 0);
      d3.select(this).style("stroke", "none").style("opacity", 0.8);
    };

    // add the squares
    svg
      .selectAll()
      .data(data)
      .join("rect")
      .attr("x", function (d: any) {
        return x(d.group) ?? 0;
      })
      .attr("y", function (d: any) {
        return y(d.variable) ?? 0;
      })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", function (d: any) {
        return myColor(d.value);
      })
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
      .style("visibility", (d: any) =>
        d.value !== undefined ? "visible" : "hidden"
      )
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave);
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
