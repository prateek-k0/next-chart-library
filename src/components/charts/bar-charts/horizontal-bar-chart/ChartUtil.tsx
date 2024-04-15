"use client";
import { ChartProps } from "@/types";
import React, { useRef, useCallback, useEffect } from "react";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import * as d3 from "d3";

const ChartUtil = ({ data }: ChartProps) => {
  const configRef = useRef({
    keys: ["average", "good", "bad"],
    selector: "bar-graph-stacked-horizontal-section",
    margin: {
      top: 20,
      bottom: 10,
      left: 100,
      right: 20,
    },
    svg: d3.select(null).select("svg") as d3.Selection<
      SVGSVGElement,
      unknown,
      null,
      undefined
    >,
    graph: d3.select(null).select("g") as d3.Selection<
      SVGGElement,
      unknown,
      null,
      undefined
    >,
    height: 0,
    width: 0,
  });

  const getPreparedData = useCallback(() => {
    const groupData: any = d3.group(data, (d: any) => d.vertical);
    let nest = [];
    // eslint-disable-next-line no-unused-vars
    for (const [key, value] of groupData.entries()) {
      nest.push(value);
    }

    nest = nest.map((verticals) => {
      const obj: any = {};
      const result: any = {};
      let key;
      const netNominal = d3.sum(verticals, (d: any) => d.value);

      key = netNominal >= 0 ? (key = "good") : (key = "bad");
      obj[key] = Math.abs(netNominal);

      // nest 2
      const groupDataInner: any = d3.group(verticals, (d: any) => d.type);
      const nestInner = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const [keyInner, value] of groupDataInner.entries()) {
        nestInner.push({ keyInner, values: value });
      }
      let nominal: any = nestInner.map((d: any) => {
        const sum = d.values.reduce(
          (acc: number, objInner: any) => acc + parseInt(objInner.value, 10),
          0
        );
        return { key: d.key, value: sum };
      });

      nominal =
        nominal.length > 1 ? d3.min(nominal, (d: any) => Math.abs(d.value)) : 0;
      obj.vertical = verticals[0].vertical;
      obj.average = nominal;
      obj.total = obj.average + obj[key];

      result.key = verticals[0].vertical;
      result.value = obj;

      return result;
    });

    const stackedData = d3.stack().keys(configRef.current.keys)(
      nest.map((d) => d.value)
    );
    return { nest, stack: stackedData };
  }, [data]);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const renderSVG = useCallback(() => {
    const container = containerRef.current as HTMLDivElement | null;
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
      (d3.select(container).node() as HTMLElement).clientWidth -
      configRef.current.margin.left -
      configRef.current.margin.right;

    configRef.current.graph = configRef.current.svg
      .append("g")
      .attr(
        "transform",
        `translate(${configRef.current.margin.left},${
          configRef.current.margin.top / 2
        })`
      );
  }, []);

  const xScale = useCallback(() => {
    const obj = getPreparedData().nest;
    return d3
      .scaleLinear()
      .domain([0, d3.max(obj, (d) => d.value.total) || 0])
      .range([1, configRef.current.width])
      .nice();
  }, [getPreparedData]);

  const yScale = useCallback(() => {
    return d3
      .scaleBand()
      .domain(getPreparedData().nest.map((d) => d.key))
      .range([configRef.current.height, 0])
      .padding(0.3);
  }, [getPreparedData]);

  const renderXAxis = useCallback(() => {
    configRef.current.graph
      .append("g")
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0, ${configRef.current.height})`)
      .call(d3.axisBottom(xScale()))
      .call((d) => d.select(".domain").remove())
      .call((d) => {
        d.selectAll("line").style("stroke-opacity", 0);
        d.selectAll("text").attr("y", 3).remove();
      });
  }, [xScale]);

  const renderYAxis = useCallback(() => {
    configRef.current.graph
      .append("g")
      .attr("class", "axis y-axis")
      .style("font-family", "Space Mono")
      .call(d3.axisLeft(yScale()))
      .call((d) => d.select(".domain").remove())
      .call((d) => d.selectAll("line").style("stroke-opacity", 0));
  }, [yScale]);

  const renderVerticalLines = useCallback(() => {
    configRef.current.graph
      .append("g")
      .attr("class", "grid")
      .style("stroke-opacity", 0.3)
      .attr("transform", `translate(0,${configRef.current.height})`)
      .call(d3.axisBottom(xScale()).tickSize(-configRef.current.height + 5))
      .call((d) => {
        d.selectAll("text")
          .attr("font-family", "Space Mono")
          .attr("font-weight", 400)
          .attr("font-size", "12px");
      })
      .call((d) => d.select(".domain").remove());
  }, [xScale]);

  const renderStacks = useCallback(() => {
    const z: d3.ScaleOrdinal<string, any, never> = d3
      .scaleOrdinal()
      .range(["#dbdbdb", "#C0C0C0", "#808080"]);
    configRef.current.graph
      .append("g")
      .selectAll("g")
      .data(getPreparedData().stack)
      .join("g")
      .attr("fill", (d: any) => z(d.key))
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("x", (d: any) => xScale()(d[0]))
      .attr("y", (d: any) => yScale()(d.data.vertical) ?? 0)
      .attr("height", yScale().bandwidth())
      .attr("width", (d) => xScale()(d[1]) - xScale()(d[0]) || 0);
  }, [getPreparedData, xScale, yScale]);

  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLDivElement | null;
    if (!container) return;
    renderSVG();
    renderXAxis();
    renderYAxis();
    renderVerticalLines();
    renderStacks();
  }, [renderSVG, renderXAxis, renderYAxis, renderVerticalLines, renderStacks]);

  useEffect(() => {
    containerRef.current !== null && renderFunc();
  }, [renderFunc]);

  const resizeHandler = useCallback(() => {
    containerRef.current !== null && renderFunc();
  }, [renderFunc]);

  useResizeObserver(containerRef, resizeHandler);

  return <div ref={containerRef}>ChartUtil</div>;
};

export default ChartUtil;
