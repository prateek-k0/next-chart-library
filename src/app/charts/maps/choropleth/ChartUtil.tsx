"use client";
import { ChartProps } from "@/types";
import React, { useRef, useCallback, useEffect } from "react";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import * as d3 from "d3";

const ChartUtil = ({ data: { geoData, popData } }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if(!container) return;
    const width = container.offsetWidth,
      height = container.offsetWidth;
    const svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // const path = d3.geoPath();
    const projection: any = d3
      .geoMercator()
      .scale(width / 6.3333)
      .center([0, 0])
      .rotate([-12, 0])
      .translate([width / 2, height / 2]);

    const colors = d3.schemeBuPu[9];
    const colorScale = d3.scaleThreshold(
      [1e6, 5e6, 1e7, 5e7, 1e8, 5e8, 1e9, 5e9],
      colors
    );

    const data = new Map();

    popData.forEach((d: any) => {
      data.set(d.code, +d.pop);
    });

    const tooltip = d3
      .select(container)
      .append("div")
      .style("display", "none")
      .attr("class", "tooltip")
      .style("background-color", "#000")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .style("position", "absolute")
      .style("color", "#fff");

    let mouseOver = function (event: MouseEvent) {
      tooltip.style("display", "block");
      d3.selectAll(".Country").transition().duration(300).style("opacity", 0.5);
      d3.select(event.target as SVGElement)
        .transition()
        .duration(0)
        .style("opacity", 1)
        .style("stroke", "#fff");
    };

    let mouseMove = function (event: MouseEvent, d: any) {
      const tooltipNode = tooltip.node() as HTMLElement;
      tooltip
        .html(`${d.properties.name}:<br />${data.get(d.id) || 0}`)
        .style("left", event.offsetX - tooltipNode.offsetWidth / 2 + "px")
        .style("top", event.offsetY + 20 + "px");
    };

    let mouseLeave = function (event: MouseEvent, d: any) {
      tooltip.style("display", "none");
      d3.selectAll(".Country").transition().duration(0).style("opacity", 1);
      d3.select(event.target as SVGElement)
        .transition()
        .duration(0)
        .style("stroke", "transparent");
    };

    svg
      .append("g")
      .selectAll("path")
      .data(geoData.features)
      .enter()
      .append("path")
      // draw each country
      .attr("d", (d: any) =>
        (d3.geoPath().projection(projection)(d) ?? "").toString()
      )
      // set the color of each country
      .attr("fill", function (d: any) {
        d.total = data.get(d.id) || 0;
        return colorScale(d.total);
      })
      .style("stroke", "transparent")
      .attr("class", function (d) {
        return "Country";
      })
      .style("opacity", 1)
      .on("mouseover", mouseOver)
      .on("mousemove", mouseMove)
      .on("mouseleave", mouseLeave);
  }, [geoData, popData]);

  useEffect(() => {
    containerRef.current !== null && renderFunc();
  }, [renderFunc]);

  const resizeHandler = useCallback(() => {
    renderFunc();
  }, [renderFunc]);

  useResizeObserver(containerRef, resizeHandler);

  return (
    <>
      <p className="text-center text-xl font-extralight font-sans">
        Country-wise population data (2004)
      </p>
      <div className="relative" ref={containerRef}></div>
    </>
  );
};

export default ChartUtil;
