"use client";
import { ChartProps } from "@/types";
import React, { useRef, useCallback, useEffect } from "react";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import * as d3 from "d3";

const ChartUtil = ({ data: dataRaw }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;

    const margin = { top: 50, right: 50, bottom: 75, left: 50 },
      width = 1600 - margin.left - margin.right,
      height = 1000 - margin.top - margin.bottom;

    const svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("viewBox", [0, 0, 1600, 1000])
      .attr("width", "100%")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    const data = Object.create(dataRaw);
    // List of node names
    const allNodes = data.nodes.map((d: any) => d.name);

    // List of groups
    let allGroups: number[] = data.nodes.map((d: any) => d.grp);
    allGroups = [...new Set(allGroups)];

    // A color scale for groups:
    const color: any = d3
      .scaleOrdinal()
      .domain(allGroups.map((d: any) => `${d}`))
      .range(d3.schemeSet3);

    // A linear scale for node size
    const size = d3.scaleLinear().domain([1, 10]).range([0.5, 8]);

    // A linear scale to position the nodes on the X axis
    const x = d3.scalePoint().range([0, width]).domain(allNodes);

    const idToNode: any = {};
    data.nodes.forEach(function (n: any) {
      idToNode[n.id] = n;
    });

    // Add the links
    const links = svg
      .selectAll("mylinks")
      .data(data.links)
      .join("path")
      .attr("d", (d: any) => {
        const start = x(idToNode[d.source].name) ?? 0; // X position of start node on the X axis
        const end = x(idToNode[d.target].name) ?? 0; // X position of end node
        return [
          "M",
          start,
          height - margin.bottom, // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
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
          height - margin.bottom,
        ] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
          .join(" ");
      })
      .style("fill", "none")
      .attr("stroke", "grey")
      .style("stroke-width", 1);

    // Add the circle for the nodes
    const nodes = svg
      .selectAll("mynodes")
      .data(data.nodes)
      .join("circle")
      .attr("cx", (d: any) => x(d.name) ?? 0)
      .attr("cy", height - margin.bottom)
      .attr("r", (d: any) => size(d.n))
      .attr("fill", (d: any) => color(d.grp))
      .attr("stroke", "white");

    // And give them a label
    const labels = svg
      .selectAll("mylabels")
      .data(data.nodes)
      .join("text")
      .attr("x", 0)
      .attr("y", 0)
      .text((d: any) => d.name)
      .style("text-anchor", "end")
      .attr(
        "transform",
        (d: any) =>
          `translate(${x(d.name)},${height - margin.bottom + 10}) rotate(-90)`
      )
      .attr("fill", "darkgrey")
      .style("font-size", 6);

    // Add the highlighting functionality
    nodes
      .on("mouseover", function (event, d: any) {
        // Highlight the nodes: every node is green except of him
        nodes.style("opacity", 0.2);
        d3.select(this).style("opacity", 1);
        // Highlight the connections
        links
          .style("stroke", (a: any) =>
            a.source === d.id || a.target === d.id ? color(d.grp) : "#b8b8b8"
          )
          .style("stroke-opacity", (a: any) =>
            a.source === d.id || a.target === d.id ? 1 : 0.2
          )
          .style("stroke-width", (a: any) =>
            a.source === d.id || a.target === d.id ? 4 : 1
          );
        labels
          .style("font-size", (b: any) => (b.name === d.name ? 18.9 : 2))
          .attr("y", (b: any) => (b.name === d.name ? 10 : 0));
      })
      .on("mouseout", (d) => {
        nodes.style("opacity", 1);
        links
          .style("stroke", "grey")
          .style("stroke-opacity", 0.8)
          .style("stroke-width", "1");
        labels.attr("y", 0).style("font-size", 6);
      });
  }, [dataRaw]);

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
