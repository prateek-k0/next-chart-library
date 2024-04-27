"use client";
import { ChartProps } from "@/types";
import React, { useRef, useCallback, useEffect } from "react";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import * as d3 from "d3";

const ChartUtil = ({ data }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;
    const margin = { top: 100, right: 25, bottom: 26, left: 175 },
      width = container.offsetWidth - margin.left - margin.right,
      height = 700 - margin.top - margin.bottom;

    const svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const categories = Object.keys(data[0]);
    const n = categories.length;

    const y = d3.scaleLinear().domain([0, 0.4]).range([height, 0]);

    const x = d3.scaleLinear().domain([-10, 140]).range([0, width]);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickSize(0))
      .call((d) =>
        d
          .selectAll("text")
          .attr("font-family", "Space Mono")
          .attr("font-size", "14px")
          .attr("y", 0)
          .attr("dy", 20)
      );

    const yName = d3
      .scaleBand()
      .domain(categories)
      .range([0, height])
      .paddingInner(1);
    svg
      .append("g")
      .call(d3.axisLeft(yName).tickSize(0))
      .call((d) =>
        d
          .selectAll("text")
          .attr("font-family", "Space Mono")
          .attr("font-size", "14px")
          .attr("x", 0)
          .attr("dx", -10)
      );

    function kernelDensityEstimator(kernel: any, X: any) {
      return function (V: any) {
        return X.map(function (x: any) {
          return [
            x,
            d3.mean(V, function (v: any) {
              return kernel(x - v);
            }),
          ];
        });
      };
    }
    function kernelEpanechnikov(k: any) {
      return function (v: any) {
        return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
      };
    }

    const kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40));
    const allDensity = [];
    for (let i = 0; i < n; i++) {
      let key = categories[i];
      let density = kde(
        data.map(function (d: any) {
          return d[key];
        })
      );
      allDensity.push({ key: key, density: density });
    }

    svg
      .selectAll("areas")
      .data(allDensity)
      .join("path")
      .attr("transform", function (d) {
        return `translate(0, ${(yName(d.key) ?? 0) - height})`;
      })
      .datum(function (d) {
        return d.density;
      })
      .attr("fill", "orange")
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.5)
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)
          .x(function (d) {
            return x(d[0]);
          })
          .y(function (d) {
            return y(d[1]);
          })
      );
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
