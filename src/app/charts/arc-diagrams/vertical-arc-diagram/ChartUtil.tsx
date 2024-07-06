"use client";
// reference: https://d3-graph-gallery.com/graph/arc_vertical.html
import { ChartProps } from "@/types";
import React, { useRef, useCallback, useEffect } from "react";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import * as d3 from "d3";

const ChartUtil = ({ data }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;
    const margin = { top: 35, right: 50, bottom: 25, left: 0 },
      width = 700 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // List of node names
    const allNodes = data.nodes.map((d: any) => d.name);

    // A linear scale to position the nodes on the X axis
    const y = d3.scalePoint().range([0, height]).domain(allNodes);

    // Add the circle for the nodes
    svg
      .selectAll("mynodes")
      .data(data.nodes)
      .join("circle")
      .attr("cx", 50)
      .attr("cy", (d: any) => y(d.name) ?? 0)
      .attr("r", 8)
      .style("fill", "#69b3a2");

    // And give them a label
    svg
      .selectAll("mylabels")
      .data(data.nodes)
      .join("text")
      .attr("x", 20)
      .attr("y", (d: any) => y(d.name) ?? 0)
      .text((d: any) => d.name)
      .style("text-anchor", "middle")
      .style("alignment-baseline", "middle")
      .attr("fill", "#fff");

    const idToNode: any = {};
    data.nodes.forEach(function (n: any) {
      idToNode[n.id] = n;
    });

    svg
      .selectAll("mylinks")
      .data(data.links)
      .join("path")
      .attr("d", (d: any) => {
        let start: number = y(idToNode[d.source].name) ?? 0; // X position of start node on the X axis
        let end: number = y(idToNode[d.target].name) ?? 0; // X position of end node
        return [
          "M",
          50,
          start, // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
          "A", // This means we're gonna build an elliptical arc
          ((start - end) / 2) * 4,
          ",", // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
          (start - end) / 2,
          0,
          0,
          ",",
          start < end ? 1 : 0,
          50,
          ",",
          end,
        ] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
          .join(" ");
      })
      .style("fill", "none")
      .attr("stroke", "#fff");
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
