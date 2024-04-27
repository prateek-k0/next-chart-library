"use client";
import React, { useEffect, useCallback, useRef } from "react";
import * as d3 from "d3";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { ChartProps } from "@/types";

const ChartUtil = ({ data }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const matrix = data;

  const renderFunc = useCallback(async () => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;

    const svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("viewBox", "0 0 440 440")
      .attr("width", "100%")
      .append("g")
      .attr("transform", "translate(220,220)");

    const colors = ["darkcyan", "steelblue", "skyblue", "turquoise"];

    const res = d3.chord().padAngle(0.05).sortSubgroups(d3.descending)(matrix);

    // add the groups on the outer part of the circle
    svg
      .datum(res)
      .append("g")
      .selectAll("g")
      .data(function (d) {
        return d.groups;
      })
      .join("g")
      .append("path")
      .style("fill", (d, i) => colors[i])
      .style("stroke", "#000")
      .attr("d", d3.arc().innerRadius(205).outerRadius(210) as any);

    svg
      .datum(res)
      .append("g")
      .selectAll("path")
      .data((d) => d)
      .join("path")
      .attr("d", d3.ribbon().radius(200) as any)
      .style("fill", (d) => colors[d.source.index]) // colors depend on the source group. Change to target otherwise.
      .style("stroke", "#000");
  }, [matrix]);
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
