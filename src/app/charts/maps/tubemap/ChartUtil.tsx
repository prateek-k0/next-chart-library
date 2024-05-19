"use client";
import React, { useCallback, useEffect, useRef } from "react";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { ChartProps } from "@/types";
import * as d3 from "d3";
// @ts-ignore
import * as d3Tube from 'd3-tube-map';

const getTranslate = (x: number | string, y: number | string, k: number | string): string[] =>  {
  return [
    'transform',
    `translate(${x}, ${y}) scale(${k})`
  ];
}

const ChartUtil = ({ data }: ChartProps) => {
  const configRef = useRef({
    width: 0,
    height: 600,
    svg: null as any,
    chart: null as any,
    containerSelection: null as any,
  });
  const self = configRef.current;
  const containerRef = useRef<HTMLDivElement>(null);

  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;
    container.innerHTML = '';
    self.width = container.offsetWidth;

    const map = d3Tube
      .tubeMap()
      .width(self.width)
      .height(self.height)
      .margin({
        top: 50,
        right: 150,  
        bottom: 50,
        left: 150
      });
      self.containerSelection = d3.select(container).datum(data).call(map);
      self.svg = self.containerSelection.select('svg');
      self.svg
        .attr('width', '100%')
        .attr('height', self.height)
        .attr('viewBox', `0 0 ${self.height} ${self.height}`)
        .attr('style', '')
      self.chart = self.svg.select('g');
      const onZoom = (event: any) => {
        const t = { ...event.transform };
        self.chart.attr(...getTranslate(t.x, t.y, t.k));
      };
      const zoom = d3.zoom()
        .scaleExtent([0.5, 2])
        .translateExtent([[0, 0], [self.width, self.height]]) // world extent
        .extent([[0, 0], [self.width, self.height]]) // viewport extent
        .on('zoom', onZoom);
      self.svg.call(zoom);
      self.chart.selectAll('text')
        .style('font-size', '8px')
        .attr('fill', '#fff');
        self.chart.select('g.river')
        .select('path')
        .attr('stroke', '#94eaff')
        .attr('stroke-width', 24);
        self.chart.select('g.stations')
        .selectAll('path')
        .attr('stroke-width', 2);
        self.chart.select('g.lines')
        .selectAll('path')
        .attr('stroke-width', 4);
        self.chart.selectAll('path.interchange')
        .attr('stroke-width', 2)
        .attr('stroke', '#fff')
        .attr('fill', '#000');
  }, [data, self]);

  useEffect(() => {
    containerRef.current !== null && renderFunc();
  }, [renderFunc]);

  const resizeHandler = useCallback(() => {
    containerRef.current && renderFunc();
  }, [renderFunc]);

  useResizeObserver(containerRef, resizeHandler);

  return <div className={`relative rounded-lg h-[${self.height}] overflow-hidden border border-zinc-500`} ref={containerRef}></div>;
};

export default ChartUtil;
