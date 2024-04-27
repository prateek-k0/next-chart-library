"use client";
import { ChartProps } from "@/types";
import React, { useEffect, useCallback, useRef } from "react";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import * as d3 from "d3";

const ChartUtil = ({ data }: ChartProps) => {
  const configRef = useRef({
    selector: "defects-package-chart-section",
    width: 600,
    height: 600,
    dataLength: 0,
    nodes: undefined as any,
    svg: undefined as any,
    rootNode: undefined as any,
  });

  const renderSVG = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;

    configRef.current.svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("viewBox", "0 0 600 600")
      .attr("class", configRef.current.selector)
      // .attr('height', configRef.current.height)
      .attr("width", "100%");
  }, []);

  const renderCircles = useCallback(() => {
    configRef.current.nodes = configRef.current.svg
      .append("g")
      .selectAll("g")
      .data(configRef.current.rootNode.descendants())
      .enter()
      .append("g")
      .attr("transform", (d: any) => `translate(${[d.x, d.y]})`);

    configRef.current.nodes
      .append("circle")
      .attr("r", (d: any) => d.r)
      .attr("cx", (d: any) => {
        if (configRef.current.dataLength === 1) {
          if (data.children[0].children.length === 2) {
            return -20;
          }
        }
        return d.children === undefined ? d.r / 3 - 15 : 0;
      })
      .attr("cy", (d: any) => {
        if (configRef.current.dataLength === 1) {
          return 0;
        }
        return d.children === undefined ? d.r / 3 - 12 : 0;
      })
      .attr("fill", (d: any) => {
        const outerFillColor = "#ffffff30";
        return d.parent === null ? outerFillColor : d.data.color;
      });
  }, [data]);

  const renderValues = useCallback(() => {
    configRef.current.nodes
      .append("text")
      .attr("dy", (d: any) =>
        d.children === undefined ? d.r / 2 - 12 : d.r / 3
      )
      .attr("dx", (d: any) =>
        d.children === undefined ? d.r / 2 - 20 : d.r / 1.3
      )
      .attr("fill", (d: any) => (d.children === undefined ? "#fff" : "#000"))
      .style("text-anchor", "middle")
      .style("font-family", "Space Mono")
      .attr("font-weight", 600)
      .style("font-size", (d: any) =>
        d.children === undefined ? d.r / 2.5 : "24px"
      )
      .text((d: any) => d.data.value);
  }, []);

  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;

    renderSVG();

    configRef.current.dataLength = data.children.length;
    const padding = data.children.length === 1 ? 0 : 20;
    const packLayout = d3
      .pack()
      .size([configRef.current.width, configRef.current.height])
      .padding(padding);
    configRef.current.rootNode = d3.hierarchy(data);
    configRef.current.rootNode.sum((d: any) => d.value);
    packLayout(configRef.current.rootNode);

    renderCircles();
    renderValues();
  }, [renderSVG, renderCircles, renderValues, data]);

  const containerRef = useRef<HTMLDivElement | null>(null);
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
