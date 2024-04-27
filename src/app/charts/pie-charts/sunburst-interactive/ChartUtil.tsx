"use client";
import React, { useEffect, useCallback, useRef } from "react";
import * as d3 from "d3";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { ChartProps } from "@/types";

// reference: https://observablehq.com/@d3/zoomable-sunburst

const ChartUtil = ({ data }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const partition = useCallback((data: any) => {
    const root = d3
      .hierarchy(data)
      .sum((d: any) => d.value)
      .sort((a: any, b: any) => b.value - a.value);
    return d3.partition().size([2 * Math.PI, root.height + 1])(root);
  }, []);

  const color = d3.scaleOrdinal(
    d3.quantize(d3.interpolateRainbow, data.children.length + 1)
  );

  const format = d3.format(",d");

  const width = 900;

  const radius = width / 6;

  const arc = d3
    .arc()
    .startAngle((d: any) => d.x0)
    .endAngle((d: any) => d.x1)
    .padAngle((d: any) => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius * 1.5)
    .innerRadius((d: any) => d.y0 * radius)
    .outerRadius((d: any) => Math.max(d.y0 * radius, d.y1 * radius - 1));

  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;

    const root = partition(data);
    root.each((d: any) => (d.current = d));

    const svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("viewBox", [0, 0, width, width])
      .style("font", "12px Space Mono");

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${width / 2})`);

    const path = g
      .append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
      .attr("fill", (d: any) => {
        while (d.depth > 1) d = d.parent;
        return color(d.data.name);
      })
      .attr("fill-opacity", (d: any) =>
        arcVisible(d.current) ? (d.children ? 0.65 : 0.35) : 0
      )
      .attr("pointer-events", (d: any) =>
        arcVisible(d.current) ? "auto" : "none"
      )
      .attr("d", (d: any) => arc(d.current));

    path
      .filter((d: any) => d.children)
      .style("cursor", "pointer")
      .on("click", clicked);

    path.append("title").text(
      (d: any) =>
        `${d
          .ancestors()
          .map((d: any) => d.data.name)
          .reverse()
          .join("/")}\n${format(d.value)}`
    );

    const label = g
      .append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .selectAll("text")
      .data(root.descendants().slice(1))
      .join("text")
      .attr("dy", "0.35em")
      .attr("fill-opacity", (d: any) => +labelVisible(d.current))
      .attr("transform", (d: any) => labelTransform(d.current))
      .attr("fill", "#fff")
      .text((d: any) => d.data.name);

    const parent = g
      .append("circle")
      .datum(root)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("click", clicked);

    function clicked(event: any, p: any) {
      parent.datum(p.parent || root);

      root.each(
        (d: any) =>
          (d.target = {
            x0:
              Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
              2 *
              Math.PI,
            x1:
              Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
              2 *
              Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth),
          })
      );

      const t: any = g.transition().duration(750);
      path
        .transition(t)
        .tween("data", (d: any) => {
          const i = d3.interpolate(d.current, d.target);
          return (t) => (d.current = i(t));
        })
        .filter(function (this: any, d: any) {
          return (+this.getAttribute("fill-opacity") ||
            arcVisible(d.target)) as boolean;
        })
        .attr("fill-opacity", (d: any) =>
          arcVisible(d.target) ? (d.children ? 0.65 : 0.35) : 0
        )
        .attr("pointer-events", (d: any) =>
          arcVisible(d.target) ? "auto" : "none"
        )

        .attrTween("d", (d: any) => () => arc(d.current) as any);

      label
        .filter(function (this: any, d: any) {
          return (+this.getAttribute("fill-opacity") ||
            labelVisible(d.target)) as boolean;
        })
        .transition(t)
        .attr("fill-opacity", (d: any) => +labelVisible(d.target))
        .attrTween("transform", (d: any) => () => labelTransform(d.current));
    }

    function arcVisible(d: any) {
      return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible(d: any) {
      return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    function labelTransform(d: any) {
      const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
      const y = ((d.y0 + d.y1) / 2) * radius;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }
  }, [partition, arc, color, format, radius, data]);

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
