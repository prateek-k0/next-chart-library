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
    var Svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleLinear().domain([4, 8]).range([0, width]);
    var xAxis = Svg.append("g")
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
    Svg.append("g")
      .call(d3.axisLeft(y))
      .call((d) =>
        d
          .selectAll("text")
          .attr("font-family", "Space Mono")
          .attr("font-size", "12px")
      );

    // Add a clipPath: everything out of this area won't be drawn.
    Svg.append("defs")
      .append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0);

    var color = d3
      .scaleOrdinal()
      .domain(["setosa", "versicolor", "virginica"])
      .range(["#c507f5ff", "#21908dff", "#fde725ff"]);

    // Add brushing
    var brush: any = d3
      .brushX() // Add the brush feature using the d3.brush function
      .extent([
        [0, 0],
        [width, height],
      ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("end", updateChart); // Each time the brush selection changes, trigger the 'updateChart' function

    // Create the scatter variable: where both the circles and the brush take place
    var scatter = Svg.append("g").attr("clip-path", "url(#clip)");

    scatter
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return x(d.Sepal_Length);
      })
      .attr("cy", function (d) {
        return y(d.Petal_Length);
      })
      .attr("r", 8)
      .style("fill", function (d) {
        return color(d.Species) as string;
      })
      .style("opacity", 0.5);

    // Add the brushing
    scatter.append("g").attr("class", "brush").call(brush);

    let idleTimeout: NodeJS.Timeout | null = null;
    function idled() {
      idleTimeout = null;
    }

    function updateChart(event: any) {
      let extent = event.selection;

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if (!extent) {
        if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
        x.domain([4, 8]);
      } else {
        x.domain([x.invert(extent[0]), x.invert(extent[1])]);
        scatter.select(".brush").call(brush.move, null); // This remove the grey brush area as soon as the selection has been done
      }
      // Update axis and circle position
      xAxis.transition().duration(1000).call(d3.axisBottom(x));
      scatter
        .selectAll("circle")
        .transition()
        .duration(1000)
        .attr("cx", function (d: any) {
          return x(d.Sepal_Length);
        })
        .attr("cy", function (d: any) {
          return y(d.Petal_Length);
        });
    }
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
