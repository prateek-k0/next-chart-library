"use client";
import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import * as d3 from "d3";
import { ChartProps } from "@/types";
import { useResizeObserver } from "@/hooks/useResizeObserver";

const ChartUtil = ({ data }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [zAngle, setZAngle] = useState<number>(30);
  const [zAspect, setZAspect] = useState<number>(40);
  const [skewX, setSkewX] = useState<number>(0);
  const [skewY, setSkewY] = useState<number>(0);

  const xShift = useMemo(() => zAspect * Math.cos(zAngle * (Math.PI / 180)), [zAngle, zAspect]);
  const yShift = useMemo(() => zAspect * Math.sin(zAngle * (Math.PI / 180)), [zAngle, zAspect]);

  const configRef = useRef({
    svg: d3.select(null) as any,
    chart: d3.select(null) as any,
    margin: {
      top: 50,
      left: 50,
      right: 50,
      bottom: 50,
    },
    width: 0,
    height: 0,
    barWidth: 60,
    svgHeight: 500,
    xScale: d3.scaleBand() as any,
    yScale: d3.scaleLinear() as any,
    colorScheme: d3.schemeTableau10,
  });
  const self = configRef.current;

  const renderSVG = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;
    self.width = container.offsetWidth - self.margin.left - self.margin.right - Math.abs(xShift);
    self.height = self.svgHeight - (self.margin.top + self.margin.bottom + yShift);
    self.svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("width", container.offsetWidth)
      .attr("height", self.svgHeight);
    self.chart = self.svg
      .append("g")
      .attr(
        "transform",
        `translate(${self.margin.left + (zAngle > 90 ? Math.abs(xShift) : 0)}, ${
          self.margin.top + yShift
        })`
      );
  }, [self, xShift, yShift, zAngle]);

  const setScales = useCallback(() => {
    self.xScale = d3
      .scalePoint()
      .range([0, self.width])
      .domain(data.map((s: any) => s.focusGroup))
      .padding(0.5);
    const domainMax: any = d3.max(data, (d: { values: number[] }) => Math.max(...d.values));
    self.yScale = d3
      .scaleLinear()
      .rangeRound([self.height, 0])
      .domain([0, domainMax * 1.25])
      .nice();
  }, [data, self]);

  const renderGrid = useCallback(() => {
    self.chart
      .append("g")
      .attr("transform", `translate(0, ${self.height})`)
      .call(d3.axisBottom(self.xScale).tickSizeOuter(0))
      .call((d: any) => {
        d.selectAll("path").remove();
        d.selectAll("line").remove();
        d.selectAll("text").attr("font-weight", 400).attr("font-size", "12px");
      });
    self.chart
      .append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(self.yScale).tickSize(-self.width).tickSizeOuter(0))
      .call((d: any) => {
        d.select(".domain").style("stroke", "#666");
        d.selectAll(".tick text").attr("x", "-10");
        d.selectAll(".tick").each((data: any, i: number, nodes: any[]) => {
          d3.select(nodes[i]).select("line").remove();
          d3.select(nodes[i])
            .append("path")
            .attr("d", `m ${0} ${0} l ${xShift} ${-yShift} l ${self.width} ${0}`)
            .attr("stroke", "#666")
            .attr("stroke-width", 0.5);
        });
        d.append("line")
          .attr("x2", self.width)
          .attr("y1", self.height)
          .attr("y2", self.height)
          .attr("stroke", "#666");
      });
  }, [self, xShift, yShift]);

  const render3DArea = useCallback(
    (
      areaGroup: SVGGElement,
      points: [number, number][],
      xDepth: number,
      yDepth: number,
      xOffset: number = 0,
      yOffset: number = 0,
      areaFill: string = "darkcyan"
    ) => {
      const areaPathContainer = d3.select(areaGroup);
      const generateFaceFront: any = d3
        .area<[number, number]>()
        .x((d) => d[0] + xOffset)
        .y1((d) => d[1] - yOffset)
        .y0(self.height - yOffset)
        .curve(d3.curveLinear);
      const generateFaceBack: any = d3
        .area<[number, number]>()
        .x((d) => d[0] + xDepth + xOffset)
        .y1((d) => d[1] - yDepth - yOffset)
        .y0(self.height - yDepth - yOffset)
        .curve(d3.curveLinear);
      // left surface
      const leftFace = areaPathContainer
        .append("polygon")
        .attr(
          "points",
          `${points[0][0] + xOffset},${self.height - yOffset} 
            ${points[0][0] + xDepth + xOffset},${self.height - yDepth - yOffset}  
            ${points[0][0] + xDepth + xOffset},${points[0][1] - yDepth - yOffset} 
            ${points[0][0] + xOffset},${points[0][1] - yOffset}`
        )
        .attr("stroke", "#fff")
        .attr("fill", areaFill)
        .attr("stroke-width", 1);
      // right surface:
      const endPoint = points.slice(-1)[0];
      const rightFace = areaPathContainer
        .append("polygon")
        .attr(
          "points",
          `${endPoint[0] + xOffset},${endPoint[1] - yOffset} 
            ${endPoint[0] + xDepth + xOffset},${endPoint[1] - yDepth - yOffset}  
            ${endPoint[0] + xDepth + xOffset},${self.height - yDepth - yOffset} 
            ${endPoint[0] + xOffset},${self.height - yOffset}`
        )
        .attr("stroke", "#fff")
        .attr("fill", areaFill)
        .attr("stroke-width", 1);
      // back surface
      areaPathContainer
        .append("path")
        .datum(points)
        .attr("d", generateFaceBack)
        .attr("stroke-width", "1px")
        .attr("fill", areaFill)
        .attr("stroke", "#fff");
      // top surface
      for (let i = 0; i < points.length - 1; i++) {
        const d1 = zAngle < 90 ? points[i] : points[points.length - 1 - i];
        const d2 = zAngle < 90 ? points[i + 1] : points[points.length - 1 - i - 1];
        const [dx1, dx2] = [d1[0] + xOffset, d1[0] + xDepth + xOffset];
        const [dy1, dy2] = [d1[1] - yOffset, d1[1] - yDepth - yOffset];
        const [dx3, dx4] = [d2[0] + xOffset + xDepth, d2[0] + xOffset];
        const [dy3, dy4] = [d2[1] - yDepth - yOffset, d2[1] - yOffset];
        const polyString = [
          [dx1, dy1].join(","),
          [dx2, dy2].join(","),
          [dx3, dy3].join(","),
          [dx4, dy4].join(","),
        ];
        areaPathContainer
          .append("polygon")
          .attr("points", polyString.join(" "))
          .attr("stroke", "#fff")
          .attr("fill", areaFill)
          .attr("stroke-width", 1);
      }
      if (zAngle < 90) rightFace.raise();
      else leftFace.raise();
      // front surface
      areaPathContainer
        .append("path")
        .datum(points)
        .attr("d", generateFaceFront)
        .attr("stroke-width", "1px")
        .attr("fill", areaFill)
        .attr("stroke", "#fff");
    },
    [self, zAngle]
  );

  const renderArea = useCallback(() => {
    const nSeries = Math.min(...data.map((d: any) => d.values.length));
    const xDepth = xShift / nSeries;
    const yDepth = yShift / nSeries;
    for (let i = nSeries - 1; i >= 0; i--) {
      const points = data.map((d: any): [number, number] => [
        self.xScale(d.focusGroup),
        self.yScale(d.values[i]),
      ]);
      const areaNode = self.chart.append("g").attr("class", "area-container").node() as SVGGElement;
      render3DArea(
        areaNode,
        points,
        xDepth,
        yDepth,
        i * xDepth,
        i * yDepth,
        self.colorScheme[nSeries - i]
      );
    }
  }, [self, xShift, yShift, data, render3DArea]);

  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;
    renderSVG();
    setScales();
    renderGrid();
    renderArea();
  }, [renderSVG, setScales, renderGrid, renderArea]);

  useEffect(() => {
    containerRef.current !== null && renderFunc();
  }, [renderFunc]);

  const resizeHandler = useCallback(() => {
    containerRef.current !== null && renderFunc();
  }, [renderFunc]);

  useResizeObserver(containerRef, resizeHandler);

  const handleZAngleChange = useCallback((event: any) => {
    setZAngle(parseInt(event.target.value));
  }, []);

  const handleZAspectChange = useCallback((event: any) => {
    setZAspect(parseInt(event.target.value));
  }, []);

  const handleSkewXChange = useCallback((event: any) => {
    setSkewX(parseInt(event.target.value));
  }, []);

  const handleSkewYChange = useCallback((event: any) => {
    setSkewY(parseInt(event.target.value));
  }, []);

  return (
    <div className="chart-container">
      <div
        ref={containerRef}
        className=""
        style={{ transform: `skew(${skewX}deg, ${skewY}deg)` }}
      ></div>
      <div className="flex justify-center items-center gap-20">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <label htmlFor="z-angle">z-Angle</label>
            <input
              type="range"
              id="z-angle"
              name="z-angle"
              min="0"
              max="180"
              onChange={handleZAngleChange}
              value={`${zAngle}`}
            />
            <p className="field-value">{zAngle}</p>
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="z-aspect">z-Aspect</label>
            <input
              type="range"
              id="z-aspect"
              name="z-aspect"
              min="0"
              max="150"
              onChange={handleZAspectChange}
              value={`${zAspect}`}
            />
            <p className="field-value">{zAspect}</p>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <label htmlFor="skew-x">skew-X</label>
            <input
              type="range"
              id="skew-x"
              name="skew-x"
              min="-30"
              max="30"
              onChange={handleSkewXChange}
              value={`${skewX}`}
            />
            <p className="field-value">{skewX}</p>
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="skew-y">skew-Y</label>
            <input
              type="range"
              id="skew-y"
              name="skew-y"
              min="-30"
              max="30"
              onChange={handleSkewYChange}
              value={`${skewY}`}
            />
            <p className="field-value">{skewY}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartUtil;
