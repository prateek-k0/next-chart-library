"use client";
import { ChartProps } from "@/types";
import React, { useRef, useCallback, useEffect } from "react";
import * as d3 from "d3";
import { useResizeObserver } from "@/hooks/useResizeObserver";

const ChartUtil = ({ data }: ChartProps) => {
  const configRef = useRef<any>({
    margin: {
      top: 10,
      bottom: 10,
      left: 75,
      right: 150,
    },
    dotRadius: 2.5,
    bandPadding: 3,
    itemsPerDot: 4,
    barPaddingInner: 0.1,
    dotRowPadding: 8,
    barPaddingOuter: 4,
    dotsPerRow: 0,
    width: 440,
    height: 600,
    svg: undefined,
    chart: undefined,
  });

  const self = configRef.current;

  const containerRef = useRef<HTMLDivElement>(null);

  const renderSVG = useCallback(() => {
    self.svg = d3
      .select(containerRef.current)
      .html("")
      .append("svg")
      .attr("width", "100%")
      .attr("height", self.height + self.margin.top + self.margin.bottom);
    self.width =
      (containerRef.current?.offsetWidth ?? 1000) -
      self.margin.left -
      self.margin.right;
    self.chart = self.svg
      .append("g")
      .attr("class", "chart-wrapper")
      .attr("transform", `translate(${self.margin.left},${self.margin.top})`);
  }, [self]);

  const yScale = useCallback(() => {
    const countryList = data.map((item: any) => item.country);
    return d3
      .scaleBand()
      .domain(countryList)
      .range([self.height, 0])
      .paddingInner(self.barPaddingInner)
      .align(0.5);
  }, [data, self]);

  const xScale = useCallback(() => {
    const barWidth = self.width;
    self.dotsPerRow = parseInt(
      `${barWidth / (self.dotRadius * 2 + self.bandPadding * 2)}`,
      10
    );
    return d3
      .scaleBand()
      .domain(d3.range(1, self.dotsPerRow + 1).map((item) => `${item}`))
      .range([0, barWidth])
      .paddingOuter(0.5)
      .align(0.5);
  }, [self]);

  const renderYAxis = useCallback(() => {
    self.chart
      .append("g")
      .attr("class", "axis y-axis left")
      .style("font-family", "Graphik")
      .attr("transform", `translate(${0}, ${0})`)
      .call(d3.axisLeft(yScale()).tickSizeInner(10).tickSizeOuter(0))
      .call((d: any) => d.selectAll("line").attr("stroke-opacity", 0))
      .call((d: any) => d.select("path.domain").attr("stroke", "#aaa"))
      .call((d: any) =>
        d
          .selectAll("text")
          .attr("font-family", "Space Mono")
          .attr("font-weight", 400)
          .attr("font-size", "12px")
      );

    self.chart
      .append("g")
      .attr("class", "axis-values-right-cont")
      .selectAll("text.axis-values-right")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "axis-values-right")
      .attr("font-family", "Space Mono")
      .attr("font-weight", 400)
      .attr("font-size", "12px")
      .attr("fill", "#44bbff")
      .attr(
        "transform",
        (d: any) =>
          `translate(${self.width}, ${
            (yScale()(d.country) ?? 0) + yScale().bandwidth() / 2
          })`
      )
      .text((d: any) => d.cases);
  }, [yScale, self, data]);

  const renderDotMatrix = useCallback(() => {
    xScale();
    const rowContainer = self.chart
      .append("g")
      .attr("class", "dot-rows")
      .attr("transform", `translate(${0}, 0)`);
    rowContainer
      .selectAll("g.dot-matrix-row")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "dot-matrix-row")
      .each((d: any, i: number, nodes: SVGGElement[]) => {
        const totalDots = Math.ceil(d.cases / self.itemsPerDot);
        const addDotsInRow = (
          row: number,
          numberOfDots = configRef.current.dotsPerRow
        ) => {
          d3.select(nodes[i])
            .selectAll(`.group${i + 1}-dots-row${row + 1}`)
            .data(d3.range(1, numberOfDots + 1))
            .enter()
            .append("circle")
            .attr("class", `dots-row${row + 1}`)
            .attr("r", configRef.current.dotRadius)
            .attr("stroke", "#a100ff")
            .attr("fill", "#a100ff")
            .attr(
              "cx",
              (dataItem) =>
                (xScale()(`${dataItem}`) ?? 0) + xScale().bandwidth() / 2
            )
            .attr("cy", row * configRef.current.dotRowPadding);
        };
        if (totalDots % configRef.current.dotsPerRow === 0) {
          const numberOfRows = totalDots / configRef.current.dotsPerRow;
          for (let row = 0; row < numberOfRows; addDotsInRow(row++));
        } else {
          const numberOfRows = Math.floor(
            totalDots / configRef.current.dotsPerRow
          );
          let row;
          for (row = 0; row < numberOfRows; addDotsInRow(row++));
          // for remaining dots:
          addDotsInRow(row, totalDots % configRef.current.dotsPerRow);
        }
        const verticalOffset =
          (yScale().bandwidth() -
            (d3.select(nodes[i]).node() as SVGGElement).getBBox().height) /
          2;
        d3.select(nodes[i]).attr(
          "transform",
          `translate(${0}, ${(yScale()(d.country) ?? 0) + verticalOffset})`
        );
      });
  }, [xScale, yScale, self, data]);

  const renderfunction = useCallback(() => {
    renderSVG();
    renderYAxis();
    renderDotMatrix();
  }, [renderSVG, renderYAxis, renderDotMatrix]);

  useEffect(() => {
    containerRef.current !== null && renderfunction();
  }, [renderfunction]);

  const resizeHandler = useCallback(() => {
    containerRef.current && renderfunction();
  }, [renderfunction]);

  useResizeObserver(containerRef, resizeHandler);

  return <div className="" ref={containerRef}></div>;
};

export default ChartUtil;
