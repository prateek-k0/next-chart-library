"use client";
// reference: https://d3-graph-gallery.com/graph/density2d_contour.html
import { ChartProps } from "@/types";
import React, { useRef, useCallback, useEffect } from "react";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import * as d3 from "d3";

const ChartUtil = ({ data: rawData }: ChartProps) => {
  const data = Object.values(rawData);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if(!container) return;
        const margin = {top: 50, right: 25, bottom: 25, left: 25},
            width = container.offsetWidth - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        const svg = d3.select(container)
        .html('')
        .append("svg")
            
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        const x = d3.scaleLinear()
            .domain([5, 20])
            .range([ 0, width ]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .call(d => d.selectAll('text')
            .attr('font-family', 'Space Mono')
            .attr('font-size', 14));

        const y = d3.scaleLinear()
            .domain([5, 22])
            .range([ height, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(y))
            .call(d => d.selectAll('text')
            .attr('font-family', 'Space Mono')
            .attr('font-size', 14));

        const densityData = d3.contourDensity()
            .x(function(d: any) { return x(d.x); })   
            .y(function(d: any) { return y(d.y); })
            .size([width, height])
            .bandwidth(20)
            (data as any)

        svg
            .selectAll("path")
            .data(densityData)
            .enter()
            .append("path")
            .attr("d", d3.geoPath())
            .attr("fill", "none")
            .attr("stroke", "#69bfdd")
            .attr("stroke-linejoin", "round")
            .attr('stroke-width', 2)
}, [data]);

useEffect(() => {
  containerRef.current !== null && renderFunc();
}, [renderFunc]);

const resizeHandler = useCallback(() => {
  containerRef.current !== null && renderFunc();
}, [renderFunc]);

useResizeObserver(containerRef, resizeHandler);

return <div ref={containerRef}></div>;
}

export default ChartUtil
