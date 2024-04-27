"use client";
import React, { useEffect, useCallback, useRef } from "react";
import * as d3 from "d3";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { ChartProps } from "@/types";

const ChartUtil = ({ data }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const configRef = useRef({
    svg: undefined as any,
    selector: "pie-circle-chart-two-section",
    width: 600,
    height: 600,
    margin: 0,
    donutChart: undefined as any,
  });

  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;

    configRef.current.svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("class", configRef.current.selector)
      .attr(
        "viewBox",
        `0 0 ${configRef.current.width} ${configRef.current.height}`
      )
      .attr("width", "100%");
    configRef.current.donutChart = configRef.current.svg
      .append("g")
      .attr(
        "transform",
        `translate(${configRef.current.width / 2},${
          configRef.current.height / 2 - 30
        })`
      )
      .attr("class", "slices labels lines circles circles");

    const radius =
      Math.min(configRef.current.width, configRef.current.height) / 3 -
      configRef.current.margin;

    const arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius((d: any) => radius + d.data.radius);
    const label = d3
      .arc()
      .outerRadius(radius)
      .innerRadius(radius + 120);
    const dot = d3
      .arc()
      .outerRadius(radius)
      .innerRadius(radius + 22);
    const pie = d3
      .pie()
      .value((d: any) => d.value)
      .sort(null);

    configRef.current.donutChart
      .selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d: any) => d.data.color);

    const legendLine = configRef.current.donutChart
      .selectAll("line")
      .data(pie(data))
      .enter();
    legendLine
      .append("line")
      .attr("x1", (d: any) => dot.centroid(d)[0])
      .attr("y1", (d: any) => dot.centroid(d)[1])
      .attr("x2", (d: any) => label.centroid(d)[0])
      .attr("y2", (d: any) => label.centroid(d)[1])
      .attr("stroke", "#ccc")
      .attr("stroke-width", "1px")
      .attr("stroke-dasharray", "1")
      .attr("fill", "none");

    const legendCircle1 = configRef.current.donutChart
      .selectAll("circle")
      .data(pie(data))
      .enter();
    configRef.current.donutChart
      .append("circle")
      .attr("r", radius + 11)
      .attr("stroke", "#aaa")
      .attr("stroke-width", "1px")
      .attr("fill", "none");

    const labels = configRef.current.donutChart
      .selectAll("text")
      .data(pie(data))
      .enter();
    labels
      .append("text")
      .attr("transform", (d: any) => `translate(${label.centroid(d)})`)
      .attr("dy", "0.4em")
      .style("text-anchor", "middle")
      .style("font-weight", "900")
      .attr("font-size", "14px")
      .attr("font-family", "Space Mono")
      .attr("fill", "#ddd")
      .text((d: any) => `${d.data.value}%`);

    legendCircle1
      .append("circle")
      .attr("class", "legendcircle")
      .attr("r", 4)
      .attr("stroke", (d: any) => d.data.color)
      .attr("stroke-width", 2)
      .attr("transform", (d: any) => `translate(${dot.centroid(d)})`)
      .attr("fill", "#121212");
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
