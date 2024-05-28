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

  const renderArea = useCallback(() => {
    const generateFaceFront: any = d3
      .area()
      .x((d: any) => self.xScale(d.focusGroup))
      .y1((d: any) => self.yScale(d.lineValue))
      .y0(self.height)
      .curve(d3.curveLinear);
    const generateFaceBack: any = d3
      .area()
      .x((d: any) => self.xScale(d.focusGroup) + xShift)
      .y1((d: any) => self.yScale(d.lineValue) - yShift)
      .y0(self.height - yShift)
      .curve(d3.curveLinear);

    const areaPathContainer = self.chart
      .append("g")
      .attr("class", "area-container");
    const spacer = 0;
    // render top surface
    const topSurfaceContainer = areaPathContainer
      .append("g")
      .attr("class", "top-surface");
    for (let i = 0; i < data.length - 1; i++) {
      const d1 = data[i];
      const d2 = data[i + 1];

      const [dx1, dx2] = [
        self.xScale(d1.focusGroup) + self.xScale.bandwidth() / 2 - spacer,
        self.xScale(d1.focusGroup) +
          xShift +
          self.xScale.bandwidth() / 2 -
          spacer,
      ];
      const [dy1, dy2] = [
        self.yScale(d1.lineValue),
        self.yScale(d1.lineValue) - yShift,
      ];

      const [dx3, dx4] = [
        self.xScale(d2.focusGroup) +
          xShift +
          self.xScale.bandwidth() / 2 +
          spacer,
        self.xScale(d2.focusGroup) + self.xScale.bandwidth() / 2 + spacer,
      ];
      const [dy3, dy4] = [
        self.yScale(d2.lineValue) - yShift,
        self.yScale(d2.lineValue),
      ];

      const polyString = [
        [dx1, dy1].join(","),
        [dx2, dy2].join(","),
        [dx3, dy3].join(","),
        [dx4, dy4].join(","),
      ].join(" ");
      topSurfaceContainer
        .append("polygon")
        .attr("points", polyString)
        .attr("stroke", "#ff0070")
        .attr("fill", "#ff007090")
        .attr("stroke-width", 1);
    }
    // surface for curves (slower)
    // const lineGen: any = d3.line()
    //   .curve(d3.curveCardinal)
    //   .x((d: any) => self.xScale(d.focusGroup) + self.xScale.bandwidth() / 2)
    //   .y((d: any) => self.yScale(d.lineValue));
    // const traceLine = topSurfaceContainer.append('path')
    //   .attr('class', 'trace-line')
    //   .attr('stroke', 'red')
    //   .attr('fill', 'none')
    //   .attr('d', lineGen(data));
    // const traceLineNode = (traceLine.node() as SVGPathElement);
    // const pathLength = traceLineNode.getTotalLength();
    // const precision = 12;
    // for(let p = 0; p <= Math.ceil(pathLength + precision); p += precision) {
    //   const currentPoint = p + precision / 2;
    //   const { x, y } = traceLineNode.getPointAtLength(currentPoint) as SVGPoint;
    //   topSurfaceContainer
    //     .append('line')
    //     .attr('stroke', '#ff0070')
    //     .attr('stroke-width', precision)
    //     .attr('x1', x)
    //     .attr('y1', y)
    //     .attr('x2', x + xShift)
    //     .attr('y2', y - yShift);
    // }

    // left surface
    topSurfaceContainer
      .append("polygon")
      .attr(
        "points",
        `${self.xScale(data[0].focusGroup) + self.xScale.bandwidth() / 2},${
          self.height
        } 
          ${
            self.xScale(data[0].focusGroup) +
            self.xScale.bandwidth() / 2 +
            xShift
          },${self.height - yShift}  
          ${
            self.xScale(data[0].focusGroup) +
            self.xScale.bandwidth() / 2 +
            xShift -
            spacer
          },${self.yScale(data[0].lineValue) - yShift} 
          ${
            self.xScale(data[0].focusGroup) +
            self.xScale.bandwidth() / 2 -
            spacer
          },${self.yScale(data[0].lineValue)}`
      )
      .attr("stroke", "#ff0070")
      .attr("fill", "#ff007090")
      .attr("stroke-width", 1);

    // right surface:
    const endPoint = data.slice(-1)[0];
    topSurfaceContainer
      .append("polygon")
      .attr(
        "points",
        `${
          self.xScale(endPoint.focusGroup) +
          self.xScale.bandwidth() / 2 +
          spacer
        },${self.yScale(endPoint.lineValue)} 
          ${
            self.xScale(endPoint.focusGroup) +
            self.xScale.bandwidth() / 2 +
            spacer +
            xShift
          },${self.yScale(endPoint.lineValue) - yShift}  
          ${
            self.xScale(endPoint.focusGroup) +
            self.xScale.bandwidth() / 2 +
            xShift
          },${self.height - yShift} 
          ${self.xScale(endPoint.focusGroup) + self.xScale.bandwidth() / 2},${
          self.height
        }`
      )
      .attr("stroke", "#ff0070")
      .attr("fill", "#ff007090")
      .attr("stroke-width", 1);

    // back surface
    areaPathContainer
      .append("path")
      .style("transform", `translateX(${self.xScale.bandwidth() / 2}px)`)
      .attr("d", () => generateFaceBack(data))
      .attr("stroke-width", "1px")
      .attr("fill", "#ff007060")
      .attr("stroke", "#ff007060");

    // front surface
    areaPathContainer
      .append("path")
      .style("transform", `translateX(${self.xScale.bandwidth() / 2}px)`)
      .attr("d", () => generateFaceFront(data))
      .attr("stroke-width", "1px")
      .attr("fill", "#ff007060")
      .attr("stroke", "#ff007060");
  }, [self, xShift, yShift, data]);

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
