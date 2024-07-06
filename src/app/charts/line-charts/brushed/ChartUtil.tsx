"use client";
// reference: https://d3-graph-gallery.com/graph/line_brushZoom.html
import React, { useEffect, useCallback, useRef } from "react";
import * as d3 from "d3";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { ChartProps } from "@/types";

const ChartUtil = ({ data: rawData }: ChartProps) => {
  const data = Object.values(rawData).filter((n: any) => n.value !== undefined);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const renderFunc = useCallback(async () => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;

    const margin = { top: 10, right: 10, bottom: 30, left: 70 },
      width = container.offsetWidth - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

    const svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const viewData = data.map((d: any) => ({
      date: d3.timeParse("%Y-%m-%d")(d.date),
      value: d.value,
    }));

    const x = d3
      .scaleTime()
      .domain(
        d3.extent(viewData, function (d) {
          return d.date;
        }) as any
      )
      .range([0, width]);
    let xAxis = svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .call((d) =>
        d
          .selectAll(".tick")
          .attr("font-family", "Space Mono")
          .attr("font-size", "14px")
      );

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(viewData, function (d) {
          return +d.value;
        }) ?? 0,
      ])
      .range([height, 0]);
    svg
      .append("g")
      .call(d3.axisLeft(y).tickSizeOuter(0))
      .call((d) =>
        d
          .selectAll("text")
          .attr("font-family", "Space Mono")
          .attr("font-size", "14px")
      );

    // Add a clipPath: everything out of this area won't be drawn.
    svg
      .append("defs")
      .append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0);

    // Add brushing
    var brush: any = d3
      .brushX() // Add the brush feature using the d3.brush function
      .extent([
        [0, 0],
        [width, height],
      ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("end", updateChart); // Each time the brush selection changes, trigger the 'updateChart' function

    // Create the line variable: where both the line and the brush take place
    var line = svg.append("g").attr("clip-path", "url(#clip)");

    // Add the line
    line
      .append("path")
      .datum(viewData)
      .attr("class", "line") // I add the class line to be able to modify this line later on.
      .attr("fill", "none")
      .attr("stroke", "#038aff")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .x(function (d: any) {
            return x(d.date);
          })
          .y(function (d: any) {
            return y(d.value);
          }) as any
      );

    line.append("g").attr("class", "brush").call(brush);

    // A function that set idleTimeOut to null
    let idleTimeout: any = null;
    function idled() {
      idleTimeout = null;
    }

    function updateChart(event: any) {
      // What are the selected boundaries?
      let extent = event.selection;

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if (!extent) {
        // This allows to wait a little bit
        if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350));
        x.domain([4, 8]);
      } else {
        x.domain([x.invert(extent[0]), x.invert(extent[1])]);
        // This remove the grey brush area as soon as the selection has been done
        line.select(".brush").call(brush.move, null);
      }

      // Update axis and line position
      xAxis
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x))
        .call((d) =>
          d
            .selectAll(".tick")
            .attr("font-family", "Space Mono")
            .attr("font-size", "14px")
        );
      line
        .select(".line")
        .transition()
        .duration(1000)
        .attr(
          "d",
          d3
            .line()
            .x(function (d: any) {
              return x(d.date);
            })
            .y(function (d: any) {
              return y(d.value);
            }) as any
        );
    }

    // If user double click, reinitialize the chart
    svg.on("dblclick", function () {
      x.domain(
        d3.extent(viewData, function (d) {
          return d.date;
        }) as any
      );
      xAxis
        .transition()
        .call(d3.axisBottom(x))
        .call((d) =>
          d
            .selectAll(".tick")
            .attr("font-family", "Space Mono")
            .attr("font-size", "14px")
        );
      line
        .select(".line")
        .transition()
        .attr(
          "d",
          d3
            .line()
            .x(function (d: any) {
              return x(d.date);
            })
            .y(function (d: any) {
              return y(d.value);
            }) as any
        );
    });
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
