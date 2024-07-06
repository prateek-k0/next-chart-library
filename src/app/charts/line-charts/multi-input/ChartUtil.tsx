"use client";
import React, { useEffect, useCallback, useRef } from "react";
import * as d3 from "d3";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { ChartProps } from "@/types";

const ChartUtil = ({ data: rawData }: ChartProps) => {
  const data = Object.values(rawData).filter(
    (n: any) => (n.valueA && n.valueB && n.valueC) !== undefined
  );
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

    const allGroup = ["valueA", "valueB", "valueC"];
    d3.select("#selectButton").selectAll("option").remove();

    d3.select("#selectButton")
      .selectAll("myOptions")
      .data(allGroup)
      .enter()
      .append("option")
      .text(function (d) {
        return d;
      }) // text showed in the menu
      .attr("value", function (d) {
        return d;
      }); // corresponding value returned by the button

    const myColor = d3.scaleOrdinal().domain(allGroup).range(d3.schemeSet2);

    // Add X axis --> it is a date format
    const x = d3.scaleLinear().domain([0, 10]).range([0, width]);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .call((d) =>
        d
          .selectAll("text")
          .attr("font-family", "Space Mono")
          .attr("font-size", "14px")
      );

    const y = d3.scaleLinear().domain([0, 20]).range([height, 0]);
    svg
      .append("g")
      .call(d3.axisLeft(y))
      .call((d) =>
        d
          .selectAll("text")
          .attr("font-family", "Space Mono")
          .attr("font-size", "14px")
      );

    const line = svg
      .append("g")
      .append("path")
      .datum(data)
      .attr(
        "d",
        d3
          .line()
          .x(function (d: any) {
            return x(+d.time);
          })
          .y(function (d: any) {
            return y(+d.valueA);
          }) as any
      )
      .attr("stroke", function (d) {
        return myColor("valueA") as string;
      })
      .style("stroke-width", 4)
      .style("fill", "none");

    function update(selectedGroup: any) {
      const dataFilter = data.map(function (d: any) {
        return { time: d.time, value: d[selectedGroup] };
      });
      line
        .datum(dataFilter)
        .transition()
        .duration(1000)
        .attr(
          "d",
          d3
            .line()
            .x(function (d: any) {
              return x(+d.time);
            })
            .y(function (d: any) {
              return y(+d.value);
            }) as any
        )
        .attr("stroke", function (d) {
          return myColor(selectedGroup) as string;
        });
    }
    d3.select("#selectButton").on("change", function (event, d) {
      const selectedOption = d3.select(this).property("value");
      update(selectedOption);
    });
  }, [data]);
  useEffect(() => {
    containerRef.current !== null && renderFunc();
  }, [renderFunc]);

  const resizeHandler = useCallback(() => {
    containerRef.current !== null && renderFunc();
  }, [renderFunc]);

  useResizeObserver(containerRef, resizeHandler);

  return (
    <>
      <select
        className=" w-32 text-zinc-200 outline-none bg-zinc-800 rounded-0 py-2"
        id="selectButton"
      ></select>
      <div ref={containerRef}></div>
    </>
  );
};

export default ChartUtil;
