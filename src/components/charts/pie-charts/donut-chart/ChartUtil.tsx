"use client";
import React, { useEffect, useCallback, useRef } from "react";
import * as d3 from "d3";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { ChartProps } from "@/types";

const ChartUtil = ({ data }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const configRef = useRef({
    selector: "donut_chart",
    width: 600,
    height: 600,
    margin: 40,
    radius: 0,
    svg: undefined as any,
    svgContainer: undefined as any,
    labelValue: "Total Resources",
    totalCount: 0,
    color: ["#6D6ACC", "#7188DC", "#67CABD", "#DC67CE"],
  });

  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;

    configRef.current.svgContainer = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("class", configRef.current.selector)
      .attr(
        "viewBox",
        `0 0 ${configRef.current.width} ${configRef.current.height}`
      )
      .attr("width", "100%");

    configRef.current.svg = configRef.current.svgContainer
      .append("g")
      .attr(
        "transform",
        `translate(${configRef.current.width / 2},${
          configRef.current.height / 2
        })`
      );
    configRef.current.radius =
      Math.min(configRef.current.width, configRef.current.height) / 2 -
      2 * configRef.current.margin;
    data.forEach((d: any) => {
      configRef.current.totalCount += d.percentage;
    });

    const mainArc = d3
      .arc()
      .innerRadius(() => configRef.current.radius * 0.7)
      .outerRadius(() => configRef.current.radius)
      .padAngle(0.025);
    const lineLength = configRef.current.radius + 30;

    const arcOuterLine = d3
      .arc()
      .innerRadius(lineLength)
      .outerRadius(lineLength);
    const arcOuterValue = d3
      .arc()
      .innerRadius(lineLength + 18)
      .outerRadius(lineLength + 18);
    const pie = d3
      .pie()
      .value((d: any) => d.percentage)
      .sort(null);
    const paths = configRef.current.svg.selectAll("g").data(pie(data)).enter();
    const dot = d3
      .arc()
      .outerRadius(configRef.current.radius)
      .innerRadius(configRef.current.radius + 10);

    // Add the polylines between chart and labels:
    paths
      .append("polyline")
      .attr("stroke", "#707070")
      .attr("stroke-width", "1px")
      .attr("stroke-dasharray", "1")
      .attr("fill", "none")
      .attr("points", (d: any) => {
        const posA = dot.centroid(d);
        const posB = arcOuterLine.centroid(d);
        return [posA, posB];
      });

    // Add circle to the polyline
    paths
      .append("circle")
      .attr("r", 3)
      .attr("transform", (d: any) => `translate(${dot.centroid(d)})`)
      .attr("fill", (d: any, i: number) => configRef.current.color[i]);

    // Add values to the charts
    paths
      .append("text")
      .attr("transform", (d: any) => `translate(${arcOuterValue.centroid(d)})`)
      .attr("font-family", "Space Mono")
      .attr("font-size", 400)
      .attr("font-size", "12px")
      .attr("fill", "#fff")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text((d: any) => `${d.value}%`);

    paths
      .append("circle")
      .attr("class", "legendBigcircle")
      .attr("r", 15)
      .attr("transform", (d: any) => `translate(${arcOuterValue.centroid(d)})`)
      .attr("fill", "transparent")
      .attr("stroke", (d: any, i: number) => configRef.current.color[i])
      .style("stroke-width", 3);

    paths
      .append("path")
      .attr("d", mainArc)
      .attr("fill", (d: any, i: number) => configRef.current.color[i]);
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
