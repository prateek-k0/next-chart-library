"use client";
import { ChartProps } from "@/types";
import React, { useEffect, useCallback, useRef } from "react";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import * as d3 from "d3";

const ChartUtil = ({ data }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const simulationRef = useRef<any>(null);
  const transformData = useCallback(() => {
    const width = 800;
    const height = 600;
    return data.map((d: any) => ({
      ...d,
      r: d.Value > 1000 ? d.Value / 30 : d.Value,
      x: width * 0.2,
      y: height,
    }));
  }, [data]);

  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;
    if (simulationRef.current !== null) simulationRef.current.stop();
    const selector = "usage-analysis-container";
    const width = 650;
    const height = 500;
    const svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("viewBox", `0 0 ${650} ${500}`)
      .attr("class", selector)
      .attr("width", "100%");
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const centerScale = d3.scalePoint().padding(1).range([0, width]);
    const forceStrength = 0.08;
    let nodes = [];
    let lables: any = null;
    nodes = transformData();
    const centre = { x: width, y: height / 2 };
    let radiusFactor = 0.12;
    let rFactor = 0.09;
    if (nodes.length > 350) {
      radiusFactor = 0.09;
      rFactor = 0.07;
    } else if (nodes.length > 0 && nodes.length < 50) {
      radiusFactor = 0.05;
      rFactor = 0.04;
    }
    function charge(d: any) {
      return d.r ** 0.2 * 0.01;
    }
    simulationRef.current = d3
      .forceSimulation()
      .force("charge", d3.forceManyBody().strength(charge))
      .force(
        "collide",
        d3.forceCollide((d: any) => d.r * radiusFactor).iterations(5)
      )
      .force("y", d3.forceY().y(centre.y))
      .force("x", d3.forceX().strength(forceStrength).x(centre.x));

    const elements = svg
      .selectAll(".bubble")
      .data(nodes, (d: any) => d.id)
      .enter()
      .append("g");

    const circles = elements
      .append("circle")
      .attr("r", (d: any) => d.r * rFactor)
      .style("fill", (d: any) => color(d.Value));

    lables = elements
      .append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .style("font-size", (d: any) => {
        let size = d.r / 4;
        size *= 1 / 4;
        if (size >= 100) {
          size -= 5;
        } else {
          size += 1;
        }
        return `${Math.round(size)}px`;
      })
      .text((d: any) => d.Value);

    function ticked() {
      circles.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);

      lables.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y);
    }

    simulationRef.current.nodes(nodes).on("tick", ticked);

    function hideTitles() {
      svg.selectAll(".title").remove();
    }

    function splitBubbles(byVar: any, data: any) {
      centerScale.domain(data.map((d: any) => d[byVar]));

      if (byVar === "all") {
        hideTitles();
      }

      simulationRef.current.force(
        "x",
        d3
          .forceX()
          .strength(forceStrength)
          .x((d: any) => centerScale(d[byVar]) as number)
      );
      simulationRef.current.alpha(5).restart();
    }
    splitBubbles("all", nodes);
  }, [transformData]);

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
