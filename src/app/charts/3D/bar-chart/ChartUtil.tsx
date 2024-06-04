"use client";
import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import * as d3 from "d3";
import { ChartProps } from "@/types";
import { useResizeObserver } from "@/hooks/useResizeObserver";

const ChartUtil = ({ data }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [zAngle, setZAngle] = useState<number>(30);
  const [zAspect, setZAspect] = useState<number>(40);
  const [skewX, setSkewX] = useState<number>(0);
  const [skewY, setSkewY] = useState<number>(0);

  const xShift = useMemo(
    () => zAspect * Math.cos(zAngle * (Math.PI / 180)),
    [zAngle, zAspect]
  );
  const yShift = useMemo(
    () => zAspect * Math.sin(zAngle * (Math.PI / 180)),
    [zAngle, zAspect]
  );

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
    barFill: "#0d384d",
  });
  const self = configRef.current;

  const renderSVG = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;
    self.width =
      container.offsetWidth -
      self.margin.left -
      self.margin.right -
      Math.abs(xShift);
    self.height =
      self.svgHeight - (self.margin.top + self.margin.bottom + yShift);
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
        `translate(${
          self.margin.left + (zAngle > 90 ? Math.abs(xShift) : 0)
        }, ${self.margin.top + yShift})`
      );
  }, [self, xShift, yShift, zAngle]);

  const setScales = useCallback(() => {
    self.xScale = d3
      .scaleBand()
      .range([0, self.width])
      .domain(data.map((s: any) => s.focusGroup))
      .padding(0);
    // self.barWidth = self.xScale.bandwidth() - 80;
    const domainMax: any = d3.max(
      data,
      (d: { value: number }) => Math.ceil(d.value / 10) * 11
    );
    self.yScale = d3
      .scaleLinear()
      .rangeRound([self.height, 0])
      .domain([0, domainMax])
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
            .attr(
              "d",
              `m ${0} ${0} l ${xShift} ${-yShift} l ${self.width} ${0}`
            )
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

  const render3DBar = useCallback(
    (
      nodeGroup: SVGGElement,
      xStart: number,
      yStart: number,
      xDepth: number,
      yDepth: number,
      xOffset: number = 0,
      yOffset: number = 0
    ) => {
      // dots for reference
      // d3.select(nodeGroup)
      //   .append("circle")
      //   .attr("cx", xStart + xOffset)
      //   .attr("cy", self.height - yOffset)
      //   .attr("r", 4)
      //   .attr("fill", "red");
      // d3.select(nodeGroup)
      //   .append("circle")
      //   .attr("cx", xStart + xOffset + self.barWidth)
      //   .attr("cy", self.height - yOffset)
      //   .attr("r", 4)
      //   .attr("fill", "red");
      // d3.select(nodeGroup)
      //   .append("circle")
      //   .attr("cx", xStart + xOffset)
      //   .attr("cy", yStart - yOffset)
      //   .attr("r", 4)
      //   .attr("fill", "red");
      // d3.select(nodeGroup)
      //   .append("circle")
      //   .attr("cx", xStart + xOffset + self.barWidth)
      //   .attr("cy", yStart - yOffset)
      //   .attr("r", 4)
      //   .attr("fill", "red");
      // d3.select(nodeGroup)
      //   .append("circle")
      //   .attr("cx", xStart + xOffset + xDepth)
      //   .attr("cy", yStart - yOffset - yDepth)
      //   .attr("r", 4)
      //   .attr("fill", "red");
      // d3.select(nodeGroup)
      //   .append("circle")
      //   .attr("cx", xStart + xOffset + self.barWidth + xDepth)
      //   .attr("cy", yStart - yOffset - yDepth)
      //   .attr("r", 4)
      //   .attr("fill", "red");
      d3.select(nodeGroup)
        .append("path")
        .attr("class", "bar-face -left")
        .attr(
          "d",
          `
            M${xStart + xOffset},${yStart - yOffset}
            l${xDepth},${-yDepth}
            v${self.height - yStart}
            l${-xDepth},${yDepth}
            Z
          `
        )
        .attr("fill", self.barFill)
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5);

      d3.select(nodeGroup)
        .append("path")
        .attr("class", "bar-face -right")
        .attr(
          "d",
          `
            M${xStart + self.barWidth + xOffset},${yStart - yOffset}
            l${xDepth},${-yDepth}
            v${self.height - yStart}
            l${-xDepth},${yDepth}
            Z
          `
        )
        .attr("fill", self.barFill)
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5);

      if (zAngle > 90) {
        d3.select(nodeGroup).select(".bar-face.-right").lower();
      }

      d3.select(nodeGroup)
        .append("path")
        .attr("class", "bar-face -front")
        .attr(
          "d",
          `
            M${xStart + xOffset},${yStart - yOffset}
            h${self.barWidth}
            v${self.height - yStart}
            h${-self.barWidth}Z
          `
        )
        .attr("fill", self.barFill)
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5);

      d3.select(nodeGroup)
        .append("path")
        .attr("class", "bar-face -top")
        .attr(
          "d",
          `
            M${xStart + xOffset},${yStart - yOffset}
            l${xDepth},${-yDepth}
            h${self.barWidth}
            l${-xDepth},${yDepth}
            Z
          `
        )
        .attr("fill", self.barFill)
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5);
    },
    [zAngle, self]
  );

  const renderBars = useCallback(() => {
    const barGroup = self.chart
      .selectAll("g.bar-group")
      .data(zAngle > 90 ? [...data].reverse() : data)
      .enter()
      .append("g")
      .attr("class", "bar-group");

    barGroup.each(
      (d: any, i: number, nodes: SVGGElement[] | ArrayLike<SVGGElement>) => {
        const xStart =
          self.xScale(d.focusGroup) +
          self.xScale.bandwidth() / 2 -
          self.barWidth / 2;
        const yStart = self.yScale(d.value);
        render3DBar(
          nodes[i],
          xStart,
          yStart,
          xShift / 2,
          yShift / 2,
          xShift / 4,
          yShift / 4
        );
      }
    );
  }, [data, xShift, yShift, self, zAngle, render3DBar]);

  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;
    renderSVG();
    setScales();
    renderGrid();
    renderBars();
  }, [renderSVG, setScales, renderGrid, renderBars]);

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
