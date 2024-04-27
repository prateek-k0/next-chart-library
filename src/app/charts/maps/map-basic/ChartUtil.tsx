'use client';
import React, { useCallback, useEffect, useRef } from 'react'
import { useResizeObserver } from '@/hooks/useResizeObserver';
import { ChartProps } from '@/types';
import * as d3 from 'd3';

const ChartUtil = ({ data }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderFunc = useCallback(() => {
        const container = containerRef.current as HTMLElement
        if(!container) return;
        const height = container?.offsetWidth ?? 0;
        const svg = d3.select(container)
            .html('')
            .append("svg")
            .attr("width", '100%')
            .attr("height", (height * 0.66))
            .append("g");

        const width = container.clientWidth;
            
        const projection = d3.geoNaturalEarth1()
            .scale(width / 4.44)
            .center([0, 0])
            .rotate([-12, 0])
            .translate([width / 2, height / 2.8383]);

        const geoData = data;

        svg.append("g")
        .selectAll("path")
        .data(geoData.features)
        .join("path")
            .attr("fill", "orange")
            .attr("d", (d: any) =>
              (d3.geoPath().projection(projection)(d) ?? "").toString()
            )
            .style("stroke", '#000');
  }, [data]);

  useEffect(() => {
    containerRef.current !== null && renderFunc();
  }, [renderFunc]);

  const resizeHandler = useCallback(() => {
    containerRef.current && renderFunc();
  }, [renderFunc]);

  useResizeObserver(containerRef, resizeHandler);

  return (
    <div className="relative" ref={containerRef}></div>
  )
}

export default ChartUtil