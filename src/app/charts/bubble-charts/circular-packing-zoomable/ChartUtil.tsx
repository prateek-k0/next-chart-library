"use client";
import { ChartProps } from "@/types";
import React, { useEffect, useCallback, useRef } from "react";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import * as d3 from "d3";

const ChartUtil = ({ data }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const configRef = useRef({
    width: 400,
    height: 350,
    absHeight: 0,
    absWidth: 0,
    svg: undefined as any,
    dataLength: undefined as any,
    rootNode: undefined as any,
    selector: "bubble-chart-packing-zoomable",
    root: undefined as any,
    focus: undefined as any,
    view: undefined as any,
    node: undefined as any,
    margin: {
      top: 20,
      bottom: 20,
      right: 20,
      left: 20,
    },
    label: undefined as any,
  });

  const prepareData = useCallback(() => {
    const pack = d3
      .pack()
      .size([configRef.current.width, configRef.current.height])
      .padding(3);
    configRef.current.root = d3.hierarchy(data);
    configRef.current.root.sum((d: any) => d.value);
    configRef.current.focus = configRef.current.root;
    pack(configRef.current.root);
  }, [data]);

  const colorScale = useCallback(() => {
    return d3
      .scaleLinear(["#fcc2fa", "#ff0000"])
      .domain([0, 5])
      .interpolate(d3.interpolateHcl as any);
  }, []);

  const zoomTo = useCallback((v: any) => {
    const k = configRef.current.absWidth / v[2];
    configRef.current.view = v;
    configRef.current.label.attr(
      "transform",
      (_d: any) => `translate(${(_d.x - v[0]) * k},${(_d.y - v[1]) * k})`
    );
    configRef.current.node.attr(
      "transform",
      (_d: any) => `translate(${(_d.x - v[0]) * k},${(_d.y - v[1]) * k})`
    );
    configRef.current.node.attr("r", (_d: any) => _d.r * k);
  }, []);

  const zoom = useCallback(
    (event: any, d: any) => {
      configRef.current.focus = d;
      let self: any = null;
      const transition = configRef.current.svg
        .transition()
        .duration(700)
        .tween("zoom", () => {
          const i = d3.interpolateZoom(configRef.current.view, [
            configRef.current.focus.x,
            configRef.current.focus.y,
            configRef.current.focus.r * 2.5,
          ]);
          return (t: any) => zoomTo(i(t));
        });

      configRef.current.label
        .filter((_d: any, i: number, arr: any[]) => {
          self = d3.select(arr[i]);
          return (
            _d.parent === configRef.current.focus ||
            self.style.display === "inline"
          );
        })
        .transition(transition)
        .attr("font-size", (_d: any) => `${_d.r / 4 + _d.depth}px`)
        .style("fill-opacity", (_d: any) =>
          _d.parent === configRef.current.focus ? 1 : 0
        )
        .on("start", (_d: any) => {
          if (_d.parent === configRef.current.focus)
            self.style.display = "inline";
        });

      event.stopPropagation();
    },
    [zoomTo]
  );

  const renderSVG = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;

    const { top, bottom, left, right } = configRef.current.margin;
    configRef.current.absHeight = configRef.current.height - (top + bottom);
    configRef.current.absWidth = configRef.current.width - (left + right);

    configRef.current.svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr(
        "viewBox",
        `-${configRef.current.absWidth / 2} -${
          configRef.current.absHeight / 2
        } ${configRef.current.absWidth} ${configRef.current.absHeight}`
      )
      .style("display", "block")
      .style("margin", "0 -14px")
      // .style('background', colorScale()(0))
      .style("cursor", "pointer")
      .on("click", (event: any) => zoom(event, configRef.current.root));
  }, [zoom]);

  const renderNodes = useCallback(() => {
    configRef.current.node = configRef.current.svg
      .append("g")
      .selectAll("circle")
      .data(configRef.current.root.descendants().slice(1))
      .join("circle")
      .attr("fill", (d: any) => (d.children ? colorScale()(d.depth) : "#fff"))
      .attr("pointer-events", (d: any) => (!d.children ? "none" : null))
      .on("mouseover", (event: any) => {
        const target = event.currentTarget;
        d3.select(target).attr("stroke", "#fff");
      })
      .on("mouseout", (event: any) => {
        const target = event.currentTarget;
        d3.select(target).attr("stroke", null);
      })
      .on(
        "click",
        (event: any, d: any) => configRef.current.focus !== d && zoom(event, d)
      );
  }, [colorScale, zoom]);

  const renderLabels = useCallback(() => {
    configRef.current.label = configRef.current.svg
      .append("g")
      .style("font", "Space Mono")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(configRef.current.root.descendants())
      .join("text")
      .text((d: any) => d.data.name)
      .style("font-family", "Space Mono")
      .style("font-weight", 600)
      .attr("font-size", (_d: any) => `${_d.r / 4}px`)
      .style("fill-opacity", (_d: any) =>
        _d.parent === configRef.current.focus ? 1 : 0
      );
  }, []);

  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;

    prepareData();
    renderSVG();
    renderNodes();
    renderLabels();
    zoomTo([
      configRef.current.root.x,
      configRef.current.root.y,
      configRef.current.root.r * 2.5,
    ]);
  }, [renderLabels, renderSVG, renderNodes, prepareData, zoomTo]);

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
