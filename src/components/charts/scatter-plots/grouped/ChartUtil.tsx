"use client";
import React, { useEffect, useCallback, useRef } from "react";
import * as d3 from "d3";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { ChartProps } from "@/types";

const ChartUtil = ({ data: rawData }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const data: any[] = Object.values(rawData).filter(
    (d: any) => d.Petal_Length !== undefined
  );
  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;

    var margin = { top: 50, right: 25, bottom: 25, left: 25 },
      width = container.offsetWidth - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleLinear().domain([4, 8]).range([0, width]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .call((d) =>
        d
          .selectAll("text")
          .attr("font-family", "Space Mono")
          .attr("font-size", "12px")
      );

    // Add Y axis
    var y = d3.scaleLinear().domain([0, 9]).range([height, 0]);
    svg
      .append("g")
      .call(d3.axisLeft(y))
      .call((d) =>
        d
          .selectAll("text")
          .attr("font-family", "Space Mono")
          .attr("font-size", "12px")
      );

    var color = d3
      .scaleOrdinal()
      .domain(["setosa", "versicolor", "virginica"])
      .range(["#c507f5ff", "#21908dff", "#fde725ff"]);

    const highlight = function (event: any, d: any) {
      let selected_specie = d.Species;
      d3.selectAll(".dot")
        .transition()
        .duration(200)
        .style("fill", "lightgrey")
        .attr("r", 3);
      d3.selectAll("." + selected_specie)
        .transition()
        .duration(200)
        .attr("fill", color(selected_specie) as string)
        .attr("r", 7);
    };

    const doNotHighlight = function () {
      d3.selectAll(".dot")
        .transition()
        .duration(200)
        .attr("fill", (d: any) => color(d.Species) as string)
        .attr("r", 5);
    };

    svg
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", function (d) {
        return "dot " + d.Species;
      })
      .attr("cx", function (d) {
        return x(d.Sepal_Length);
      })
      .attr("cy", function (d) {
        return y(d.Petal_Length);
      })
      .attr("r", 5)
      .style("fill", function (d) {
        return color(d.Species) as string;
      });
    // .on("mouseenter", highlight)
    // .on("mouseleave", doNotHighlight )
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
