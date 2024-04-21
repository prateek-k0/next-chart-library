"use client";
import React, { useEffect, useCallback, useRef } from "react";
import * as d3 from "d3";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { ChartProps } from "@/types";

const ChartUtil = ({ data }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const configRef = useRef({
    selector: "sun-burst-chart",
    width: 650,
    height: 450,
    svg: undefined as any,
    rootNode: undefined as any,
    radius: 150,
    color: undefined as any,
  });

  const renderSVG = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;

    configRef.current.svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("class", configRef.current.selector)
      .attr("width", "100%")
      .attr(
        "viewBox",
        `${-(configRef.current.width / 2)} ${-(configRef.current.height / 2)} ${
          configRef.current.width
        } ${configRef.current.height}`
      );
  }, []);

  const transformData = useCallback(() => {
    const partitionLayout = d3
      .partition()
      .size([2 * Math.PI, configRef.current.radius]);
    configRef.current.rootNode = d3.hierarchy(data).sum((d) => d.value);
    partitionLayout(configRef.current.rootNode);
  }, [data]);

  const getPie = useCallback(() => {
    return d3
      .pie()
      .value((d: any) => d.value)
      .sort(null);
  }, []);

  const getPieArc = useCallback(() => {
    return d3
      .arc()
      .innerRadius((d: any) => d.data.y1 + 28)
      .outerRadius((d: any) => d.data.y1 + 28);
  }, []);

  const midAngle = useCallback(
    (d: any) => d.startAngle + (d.endAngle - d.startAngle) / 2,
    []
  );

  const renderArc = useCallback(() => {
    const arcGenerator = d3
      .arc()
      .startAngle((d: any) => d.x0)
      .endAngle((d: any) => d.x1)
      .padAngle((d: any) => Math.min((d.x1 - d.x0) / 2, 0.05))
      .padRadius(configRef.current.radius / 2)
      .innerRadius((d: any) => d.y0)
      .outerRadius((d: any) => d.y1 - 2);

    const format = d3.format(",d");

    configRef.current.svg
      .append("g")
      .selectAll("path")
      .data(
        configRef.current.rootNode.descendants().filter((d: any) => d.depth)
      )
      .join("path")
      .attr("fill", (d: any) => {
        let dataItem = d;
        while (dataItem.depth > 1) {
          dataItem = dataItem.parent;
        }
        return dataItem.data.color;
      })
      .attr("d", arcGenerator)
      .attr("fill-opacity", 1)
      .append("title")
      .text(
        (d: any) =>
          `${d
            .ancestors()
            .map((dataItem: any) => dataItem.data.name)
            .reverse()
            .join("/")}\n${format(d.value)}`
      );
  }, []);

  const renderDataTitle = useCallback(() => {
    const pie = getPie();
    const data = configRef.current.rootNode
      .descendants()
      .filter((d: any) => d.depth > 1);
    const labelArc = getPieArc();
    configRef.current.svg
      .append("g")
      .selectAll("text")
      .data(pie(data))
      .join("text")
      .text((d: any) => d.data.data.name)
      .attr("transform", (d: any) => {
        const pos = labelArc.centroid(d);
        pos[0] = (d.data.y1 + 50) * (midAngle(d) < Math.PI ? 1 : -1);
        pos[1] -= 11;
        return `translate(${pos})`;
      })
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .attr("font-size", "14")
      .attr("font-family", "Space Mono")
      .attr("fill", "#fff")
      .attr("dy", "15")
      .style("text-anchor", (d: any) =>
        midAngle(d) < Math.PI ? "start" : "end"
      );
  }, [getPie, getPieArc, midAngle]);

  const renderLegendLines = useCallback(() => {
    const arc = d3
      .arc()
      .innerRadius((d: any) => d.data.y0)
      .outerRadius((d: any) => d.data.y1 + 40);
    const pie = getPie();
    const data = configRef.current.rootNode
      .descendants()
      .filter((d: any) => d.depth > 1);
    const outerArc = getPieArc();

    configRef.current.svg
      .append("g")
      .selectAll("lines")
      .data(pie(data))
      .join("polyline")
      .attr("opacity", "1")
      .attr("stroke", "#707070")
      .attr("stroke-width", "1px")
      .attr("stroke-dasharray", "1")
      .attr("fill", "none")
      .attr("points", (d: any) => {
        const innerPos = arc.centroid(d);
        const pos = outerArc.centroid(d);
        pos[0] = (d.data.y1 + 40) * (midAngle(d) < Math.PI ? 1 : -1);
        return [innerPos, outerArc.centroid(d), pos];
      });
  }, [getPie, getPieArc, midAngle]);

  const renderLegendMarkers = useCallback(() => {
    const pie = getPie();
    const data = configRef.current.rootNode
      .descendants()
      .filter((d: any) => d.depth > 1);
    const circleArc = getPieArc();

    configRef.current.svg
      .append("g")
      .selectAll("circles")
      .data(pie(data))
      .join("circle")
      .attr("transform", (d: any) => {
        const pos = circleArc.centroid(d);
        pos[0] = (d.data.y1 + 40) * (midAngle(d) < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .attr("r", "4")
      .attr("class", "legendSmallCircle")
      .attr("cx", (d: any) => d.x0)
      .attr("cy", (d: any) => d.y0)
      .attr("fill", (d: any) => d.data.parent.data.color);
  }, [getPie, getPieArc, midAngle]);

  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;

    transformData();
    renderSVG();
    renderArc();
    renderDataTitle();
    renderLegendLines();
    renderLegendMarkers();
  }, [
    renderArc,
    renderSVG,
    renderDataTitle,
    transformData,
    renderLegendLines,
    renderLegendMarkers,
  ]);

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
