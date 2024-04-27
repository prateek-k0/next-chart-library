"use client";
import { ChartProps } from "@/types";
import React, { useRef, useCallback, useEffect } from "react";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import * as d3 from "d3";

const ChartUtil = ({ data }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const configRef = useRef({
    selector: "density-chart",
    width: 100,
    height: 100,
    margin: {
      top: 50,
      bottom: 50,
      left: 25,
      right: 0,
    },
    svg: undefined as any,
    chart: undefined as any,
    color: ["#8FD399", "#DC67CE", "#9657D5"],
  });

  const renderSVG = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;
    const contHeight = 640;
    configRef.current.height =
      contHeight -
      configRef.current.margin.top -
      configRef.current.margin.bottom;
    configRef.current.svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("class", configRef.current.selector)
      .attr(
        "height",
        configRef.current.height +
          configRef.current.margin.top +
          configRef.current.margin.bottom
      )
      .attr("width", "100%");

    configRef.current.width =
      container.offsetWidth -
      configRef.current.margin.left -
      configRef.current.margin.right;

    configRef.current.chart = configRef.current.svg
      .append("g")
      .attr(
        "transform",
        `translate(${configRef.current.margin.left}, ${configRef.current.margin.top})`
      );
  }, []);

  const xScale = useCallback(() => {
    return d3
      .scaleBand()
      .range([0, configRef.current.width])
      .domain(data.map((d: any) => d.Xvalue))
      .padding(0);
  }, [data]);

  const yScale = useCallback(() => {
    return d3
      .scaleLinear()
      .rangeRound([configRef.current.height, 0])
      .domain([0, 30])
      .nice();
  }, []);

  const makeYLines = useCallback(() => {
    return d3.axisLeft(yScale()).tickPadding(10).ticks(5);
  }, [yScale]);

  const renderGrid = useCallback(() => {
    const grid = configRef.current.chart
      .append("g")
      .attr("class", "grid")
      .attr(
        "transform",
        `translate(${[
          configRef.current.margin.left - 15,
          configRef.current.margin.top - 20,
        ]})`
      )
      .call(makeYLines().tickSize(-configRef.current.width + 90));

    grid
      .selectAll("text")
      .attr("font-family", "Space Mono")
      .attr("font-size", "12px");
  }, [makeYLines]);

  const createPaths = useCallback(
    (chart: any, xScale: any, yScale: any, margin: any) => {
      const cat1color = "#8FD399";
      const cat2color = "#DC67CE";
      const cat3color = "#9657D5";

      const areaGroup = chart.selectAll().data(data).enter().append("g");

      const areacat1 = d3
        .area()
        .curve(d3.curveCardinal)
        .x((d: any) => xScale(d.Xvalue))
        .y0(yScale(0))
        .y1((d: any) => yScale(d.cat1));

      areaGroup
        .append("path")
        .attr("class", "area-cat-1 area-path")
        .attr("transform", `translate(${margin.left - 15}, ${margin.top - 20})`)
        .style("fill", () => cat1color)
        .attr("opacity", 0.1)
        .attr("d", () => areacat1(data))
        .on("mouseover", () => {
          d3.selectAll(".area-cat-1").attr("opacity", 0.25);
        })
        .on("mouseleave", () => {
          d3.selectAll(".area-path").attr("opacity", 0.1);
        });

      const areacat2 = d3
        .area()
        .curve(d3.curveCardinal)
        .x((d: any) => xScale(d.Xvalue))
        .y0(yScale(0))
        .y1((d: any) => yScale(d.cat2));

      areaGroup
        .append("path")
        .attr("class", "area-cat-2 area-path")
        .attr("transform", `translate(${margin.left - 15}, ${margin.top - 20})`)
        .style("fill", () => cat2color)
        .attr("opacity", 0.1)
        .attr("d", () => areacat2(data))
        .on("mouseover", () => {
          d3.selectAll(".area-cat-2").attr("opacity", 0.25);
        })
        .on("mouseleave", () => {
          d3.selectAll(".area-path").attr("opacity", 0.1);
        });

      const areacat3 = d3
        .area()
        .curve(d3.curveCardinal)
        .x((d: any) => xScale(d.Xvalue))
        .y0(yScale(0))
        .y1((d: any) => yScale(d.cat3));

      areaGroup
        .append("path")
        .attr("class", "area-cat-3 area-path")
        .attr("transform", `translate(${margin.left - 15}, ${margin.top - 20})`)
        .style("fill", "crimson")
        .attr("opacity", 0.1)
        .attr("d", () => areacat3(data))
        .on("mouseover", () => {
          d3.selectAll(".area-cat-3").attr("opacity", 0.25);
        })
        .on("mouseleave", () => {
          d3.selectAll(".area-path").attr("opacity", 0.1);
        });
    },
    [data]
  );

  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;

    renderSVG();
    renderGrid();
    createPaths(
      configRef.current.chart,
      xScale(),
      yScale(),
      configRef.current.margin
    );
  }, [renderGrid, renderSVG, xScale, yScale, createPaths]);
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
