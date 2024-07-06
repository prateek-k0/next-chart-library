"use client";
// refernce: https://d3-graph-gallery.com/graph/arc_basic.html
import { ChartProps } from "@/types";
import React, { useRef, useCallback, useEffect } from "react";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import * as d3 from "d3";

const ChartUtil = ({ data }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;
    const margin = { top: 25, right: 10, bottom: 10, left: 10 },
      width = container.offsetWidth - margin.left - margin.right,
      height = container.offsetWidth * 0.4 - margin.top - margin.bottom;

    const svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // List of node names
    var allNodes: any[] = data.nodes.map((d: any) => d.name);

    // A linear scale to position the nodes on the X axis
    var x: any = d3.scalePoint().range([0, width]).domain(allNodes);

    // Add the circle for the nodes
    svg
      .selectAll("mynodes")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("cx", (d: any) => x(d.name))
      .attr("cy", height - 30)
      .attr("r", 8)
      .style("fill", "#69b3a2");

    // And give them a label
    svg
      .selectAll("mylabels")
      .data(data.nodes)
      .enter()
      .append("text")
      .attr("x", (d: any) => x(d.name))
      .attr("y", height - 5)
      .text((d: any) => d.name)
      .style("text-anchor", "middle")
      .attr("fill", "#fff");

    var idToNode: any = {};
    data.nodes.forEach((node: any) => (idToNode[node.id] = node));

    svg
      .selectAll("mylinks")
      .data(data.links)
      .enter()
      .append("path")
      .attr("d", function (d: any) {
        let start = x(idToNode[d.source].name); // X position of start node on the X axis
        let end = x(idToNode[d.target].name); // X position of end node
        return [
          "M",
          start,
          height - 30, // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
          "A", // This means we're gonna build an elliptical arc
          (start - end) / 2,
          ",", // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
          (start - end) / 2,
          0,
          0,
          ",",
          start < end ? 1 : 0,
          end,
          ",",
          height - 30,
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
