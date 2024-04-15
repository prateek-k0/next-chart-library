"use client";
import { ChartProps } from "@/types";
import React, { useRef, useCallback, useEffect } from "react";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import * as d3 from "d3";

const ChartUtil = ({ data }: ChartProps) => {
  const configRef = useRef({
    margin: {
      top: 80,
      bottom: 10,
      left: 5,
      right: 5,
    },
    svg: d3.select(null).select("svg") as d3.Selection<
      SVGSVGElement,
      unknown,
      null,
      undefined
    >,
    top_n: 12,
    width: 0,
    height: 600,
    xScale: d3.scaleLinear() as d3.ScaleLinear<number, number, never>,
    yScale: d3.scaleLinear() as d3.ScaleLinear<number, number, never>,
    tickDuration: 500,
    barPadding: undefined,
    textContent: undefined,
    year: 2000,
    value: undefined,
    yearSlice: undefined,
    xAxis: undefined as any,
    valueLabels: undefined as any,
    d3Ticker: d3.interval(() => {}) as d3.Timer,
  });

  const containerRef = useRef<HTMLDivElement | null>(null);

  const renderSVG = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    configRef.current.svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("height", configRef.current.height)
      .attr("width", "100%");

    configRef.current.width = (
      d3.select(container).node() as HTMLElement
    ).offsetWidth;
  }, []);

  const renderFunc = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;
    renderSVG();
    const barPadding =
      (configRef.current.height -
        (configRef.current.margin.bottom + configRef.current.margin.top)) /
      (configRef.current.top_n * 5);
    configRef.current.svg
      .append("text")
      .attr("class", "title")
      .attr("y", 24)
      .attr("x", configRef.current.margin.left)
      .attr("font-size", "18px")
      .style("font-family", "Space Mono")
      .text("18 years of Interbrand's Top Global Brands")
      .attr("fill", "#fff");

    configRef.current.svg
      .append("text")
      .attr("class", "subTitle")
      .attr("y", 55)
      .attr("x", configRef.current.margin.left)
      .style("font-family", "Space Mono")
      .style("font-weight", "500")
      // .style('fill', '#777777')
      .html("Brand value, $m")
      .attr("fill", "#fff");

    configRef.current.svg
      .append("text")
      .attr("class", "caption")
      .attr("x", configRef.current.width)
      .attr("y", configRef.current.height - 5)
      .style("text-anchor", "end")
      .style("font-weight", "600")
      .style("font-size", "14px")
      .style("font-family", "Space Mono")
      .attr("fill", "#fff");

    data.forEach((d: any) => {
      d.value = +d.value;
      d.lastValue = +d.lastValue;
      d.value = Number.isNaN(d.value) ? 0 : d.value;
      d.year = +d.year;
      d.colour = d3.hsl(Math.random() * 360, 0.75, 0.75);
    });

    let yearSlice = data
      .filter(
        (d: any) => d.year === configRef.current.year && !Number.isNaN(d.value)
      )
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, configRef.current.top_n);

    yearSlice.forEach((d: any, i: number) => {
      d.rank = i;
    });
    configRef.current.xScale = d3
      .scaleLinear()
      .domain([0, d3.max(Object.values(yearSlice), (d: any) => d.value)])
      .range([
        configRef.current.margin.left,
        configRef.current.width - configRef.current.margin.right - 65,
      ]);

    configRef.current.yScale = d3
      .scaleLinear()
      .domain([configRef.current.top_n, 0])
      .range([
        configRef.current.height - configRef.current.margin.bottom,
        configRef.current.margin.top,
      ]);

    configRef.current.xAxis = d3
      .axisTop(configRef.current.xScale)
      .scale(configRef.current.xScale)
      .ticks(configRef.current.width > 500 ? 5 : 2)
      .tickSize(
        -(
          configRef.current.height -
          configRef.current.margin.top -
          configRef.current.margin.bottom
        )
      )
      .tickFormat((d) => d3.format(",")(d));

    configRef.current.svg
      .append("g")
      .attr("class", "axis xAxis")
      .style("font-family", "Space Mono")
      .attr("transform", `translate(0, ${configRef.current.margin.top})`)
      .call(configRef.current.xAxis)
      .call((d) => d.selectAll("text").attr("font-size", 12))
      .selectAll(".tick line")
      .style("shape-rendering", "CrispEdges")
      .attr("stroke", "grey");

    configRef.current.svg.select(".domain").attr("style", "display:none");

    configRef.current.svg
      .selectAll("rect.bar")
      .data(Object.values(yearSlice), (d: any) => d.name)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", configRef.current.xScale(0) + 1)
      .attr(
        "width",
        (d: any) =>
          configRef.current.xScale(d.value) - configRef.current.xScale(0) - 1
      )
      .attr("y", (d: any) => configRef.current.yScale(d.rank) + 5)
      .attr(
        "height",
        configRef.current.yScale(1) - configRef.current.yScale(0) - barPadding
      )
      .style("fill", (d: any) => d.colour);

    configRef.current.svg
      .selectAll("text.label")
      .data(yearSlice, (d: any) => d.name)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d: any) => configRef.current.xScale(d.value) - 8)
      .attr(
        "y",
        (d: any) =>
          configRef.current.yScale(d.rank) +
          5 +
          (configRef.current.yScale(1) - configRef.current.yScale(0)) / 2 +
          1
      )
      .style("text-anchor", "end")
      .style("font-family", "Space Mono")
      .style("font-weight", 600)
      .html((d: any) => d.name);

    configRef.current.svg
      .selectAll("text.valueLabel")
      .data(yearSlice, (d: any) => d.name)
      .enter()
      .append("text")
      .attr("class", "valueLabel")
      .attr("x", (d: any) => configRef.current.xScale(d.value) + 5)
      .attr(
        "y",
        (d: any) =>
          configRef.current.yScale(d.rank) +
          5 +
          (configRef.current.yScale(1) - configRef.current.yScale(0)) / 2 +
          1
      )
      .style("font-family", "Space Mono")
      .style("font-weight", "300")
      .text((d: any) => d3.format(",.0f")(d.lastValue))
      .attr("fill", "#fff");

    const yearText = configRef.current.svg
      .append("text")
      .attr("class", "yearText")
      .attr("x", configRef.current.width - configRef.current.margin.right)
      .attr("y", configRef.current.height - 25)
      .style("text-anchor", "end")
      .style("font-family", "Space Mono")
      .style("font-weight", "600")
      .style("font-size", "64px")
      .style("fill", "darkgrey")
      .html((~~configRef.current.year).toString());

    configRef.current.d3Ticker = d3.interval(() => {
      if (configRef.current.year === 2018) return;
      yearSlice = data
        .filter(
          (d: any) =>
            d.year === configRef.current.year && !Number.isNaN(d.value)
        )
        .sort((a: any, b: any) => b.value - a.value)
        .slice(0, configRef.current.top_n);

      yearSlice.forEach((d: any, i: number) => {
        d.rank = i;
      });
      configRef.current.xScale.domain([
        0,
        +(d3.max(yearSlice, (d: any) => d.value) ?? 0),
      ]);

      configRef.current.svg
        .select(".xAxis")
        .transition()
        .duration(configRef.current.tickDuration)
        .ease(d3.easeLinear)
        .call(configRef.current.xAxis)
        .call((d) => d.selectAll("text").attr("font-size", 12))
        .selectAll(".tick:not(:first-of-type) line")
        .attr("stroke", "grey");

      const bars = configRef.current.svg
        .selectAll(".bar")
        .data(yearSlice, (d: any) => d.name);

      bars
        .enter()
        .append("rect")
        .attr("class", (d: any) => `bar ${d.name.replace(/\s/g, "_")}`)
        .attr("x", configRef.current.xScale(0) + 1)
        .attr(
          "width",
          (d: any) =>
            configRef.current.xScale(d.value) - configRef.current.xScale(0) - 1
        )
        .attr(
          "y",
          () => configRef.current.yScale(configRef.current.top_n + 1) + 5
        )
        .attr(
          "height",
          configRef.current.yScale(1) - configRef.current.yScale(0) - barPadding
        )
        .style("fill", (d: any) => d.colour)
        .transition()
        .duration(configRef.current.tickDuration)
        .ease(d3.easeLinear)
        .attr("y", (d: any) => configRef.current.yScale(d.rank) + 5);

      bars
        .transition()
        .duration(configRef.current.tickDuration)
        .ease(d3.easeLinear)
        .attr(
          "width",
          (d: any) =>
            configRef.current.xScale(d.value) - configRef.current.xScale(0) - 1
        )
        .attr("y", (d: any) => configRef.current.yScale(d.rank) + 5);

      bars
        .exit()
        .transition()
        .duration(configRef.current.tickDuration)
        .ease(d3.easeLinear)
        .attr(
          "width",
          (d: any) =>
            configRef.current.xScale(d.value) - configRef.current.xScale(0) - 1
        )
        .attr(
          "y",
          () => configRef.current.yScale(configRef.current.top_n + 1) + 5
        )
        .remove();

      const labels = configRef.current.svg
        .selectAll(".label")
        .data(yearSlice, (d: any) => d.name);

      labels
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", (d: any) => configRef.current.xScale(d.value) - 8)
        .attr(
          "y",
          () =>
            configRef.current.yScale(configRef.current.top_n + 1) +
            5 +
            (configRef.current.yScale(1) - configRef.current.yScale(0)) / 2
        )
        .style("text-anchor", "end")
        .style("font-weight", "600")
        .style("font-family", "Space Mono")
        .html((d: any) => d.name)
        .transition()
        .duration(configRef.current.tickDuration)
        .ease(d3.easeLinear)
        .attr(
          "y",
          (d: any) =>
            configRef.current.yScale(d.rank) +
            5 +
            (configRef.current.yScale(1) - configRef.current.yScale(0)) / 2 +
            1
        );

      labels
        .transition()
        .duration(configRef.current.tickDuration)
        .ease(d3.easeLinear)
        .attr("x", (d: any) => configRef.current.xScale(d.value) - 8)
        .attr(
          "y",
          (d: any) =>
            configRef.current.yScale(d.rank) +
            5 +
            (configRef.current.yScale(1) - configRef.current.yScale(0)) / 2 +
            1
        );

      labels
        .exit()
        .transition()
        .duration(configRef.current.tickDuration)
        .ease(d3.easeLinear)
        .attr("x", (d: any) => configRef.current.xScale(d.value) - 8)
        .attr(
          "y",
          () => configRef.current.yScale(configRef.current.top_n + 1) + 5
        )
        .remove();

      configRef.current.valueLabels = configRef.current.svg
        .selectAll(".valueLabel")
        .data(yearSlice, (d: any) => d.name);
      configRef.current.valueLabels
        .enter()
        .append("text")
        .attr("class", "valueLabel")
        .attr("x", (d: any) => configRef.current.xScale(d.value) + 5)
        .attr(
          "y",
          () => configRef.current.yScale(configRef.current.top_n + 1) + 5
        )
        .text((d: any) => d3.format(",.0f")(d.lastValue))
        .attr("fill", "#fff")
        .style("font-family", "Space Mono")
        .transition()
        .duration(configRef.current.tickDuration)
        .ease(d3.easeLinear)
        .attr(
          "y",
          (d: any) =>
            configRef.current.yScale(d.rank) +
            5 +
            (configRef.current.yScale(1) - configRef.current.yScale(0)) / 2 +
            1
        );

      configRef.current.valueLabels
        .transition()
        .duration(configRef.current.tickDuration)
        .ease(d3.easeLinear)
        .attr("x", (d: any) => configRef.current.xScale(d.value) + 5)
        .attr(
          "y",
          (d: any) =>
            configRef.current.yScale(d.rank) +
            5 +
            (configRef.current.yScale(1) - configRef.current.yScale(0)) / 2 +
            1
        )
        .tween("text", (d: any, index: number, nodes: any[]) => {
          const i = d3.interpolateRound(d.lastValue, d.value);
          return (t: any) => {
            nodes[index].textContent = d3.format(",")(i(t));
          };
        });

      configRef.current.valueLabels
        .exit()
        .transition()
        .duration(configRef.current.tickDuration)
        .ease(d3.easeLinear)
        .attr("x", (d: any) => configRef.current.xScale(d.value) + 5)
        .attr(
          "y",
          () => configRef.current.yScale(configRef.current.top_n + 1) + 5
        )
        .remove();

      yearText.html((~~configRef.current.year).toString());

      if (configRef.current.year === 2018) configRef.current.d3Ticker.stop();
      configRef.current.year = Number(
        d3.format(".1f")(+configRef.current.year + 0.1)
      );
    }, configRef.current.tickDuration);
  }, [renderSVG, data]);

  const onCleanup = useCallback(() => {
    configRef.current.d3Ticker?.stop();
    // uncomment the following for full re-render of the graph on change in dep (ie., theme)

    // configRef.current = {
    //     selector: 'racing-bar-chart-section',
    //     margin: {
    //         top: 80, bottom: 0, left: 35, right: 35,
    //     },
    //     svg: undefined,
    //     top_n: 12,
    //     width: 0,
    //     height: 600,
    //     xScale: undefined,
    //     yScale: undefined,
    //     tickDuration: 500,
    //     barPadding: undefined,
    //     textContent: undefined,
    //     year: 2000,
    //     value: undefined,
    //     yearSlice: undefined,
    //     xAxis: undefined,
    //     valueLabels: undefined,
    //     d3Ticker: undefined
    // }
  }, []);

  useEffect(() => {
    containerRef.current !== null && renderFunc();
    return () => {
      onCleanup();
    };
  }, [renderFunc, onCleanup]);

  const resizeHandler = useCallback(() => {
    onCleanup();
    containerRef.current !== null && renderFunc();
  }, [renderFunc, onCleanup]);

  useResizeObserver(containerRef, resizeHandler);

  return <div ref={containerRef}></div>;
};

export default ChartUtil;
