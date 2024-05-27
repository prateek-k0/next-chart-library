"use client";
import React, { useEffect, useCallback, useRef } from "react";
import * as d3 from "d3";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { ChartProps } from "@/types";

const getTranslate = (
  x: number | string,
  y: number | string,
  k: number | string
) => ["transform", `translate(${x}, ${y}) scale(${k})`];

const ChartUtil = ({ data }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const configRef = useRef({
    width: 1000,
    height: 1000,
    radius: 477,
    viewportWidth: 0,
    viewportHeight: 500,
    minimapWidth: 200,
    minimapHeight: 200,
    containerSelector: "chart-wrapper",
    minimapSelector: "chart-minimap",
    hierarchyData: null as any,
    svg: null as any,
    chart: null as any,
    minimapSvg: null as any,
    minimapChart: null as any,
    linkgroup: null as any,
    minimapLinkgroup: null as any,
    nodegroup: null as any,
    minimapNodegroup: null as any,
    gBrush: null as any,
    brush: null as any,
    panWrapper: null as any,
    zoom: null as any,
    tree: null as any,
    animationDuration: 200,
  });

  const self = configRef.current;
  self.radius = self.width / 2 - 10;
  self.tree = d3
    .tree()
    .size([2 * Math.PI, self.radius])
    .separation((a, b) => (a.parent === b.parent ? 2 : 3));

  const renderChart = useCallback(() => {
    self.linkgroup = self.chart
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "#888")
      .attr("stroke-width", 1.5);
    self.nodegroup = self.chart
      .append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3);

    const hierarchyData = d3.hierarchy(data);
    const root = self.tree(hierarchyData);

    const linksData = root.links();
    const links = self.linkgroup
      .selectAll("path")
      .data(
        linksData,
        (d: any) => `${d.source.data.name}_${d.target.data.name}`
      );
    links.exit().remove();
    const r: any = 0.1;
    links
      .enter()
      .append("path")
      .attr(
        "d",
        d3
          .linkRadial()
          .angle((d: any) => d.x)
          .radius(r)
      );
    const t: any = d3
      .transition()
      .duration(self.animationDuration)
      .ease(d3.easeLinear);
    const alllinks = self.linkgroup.selectAll("path");
    alllinks.transition(t).attr(
      "d",
      d3
        .linkRadial()
        .angle((d: any) => d.x)
        .radius((d: any) => d.y)
    );

    const nodesData = root.descendants().reverse();
    const nodes = self.nodegroup.selectAll("g").data(nodesData, (d: any) => {
      if (d.parent) {
        return d.parent.data.name + d.data.name;
      }
      return d.data.name;
    });
    nodes.exit().remove();
    const newnodes = nodes.enter().append("g");
    const allnodes = self.nodegroup.selectAll("g").transition(t);
    allnodes.attr(
      "transform",
      (d: any) => `
            rotate(${(d.x * 180) / Math.PI - 90})
            translate(${d.y},0)
          `
    );
    newnodes.append("circle").attr("r", 3).attr('stroke', '#e11d48').attr('stroke-width', 1.5);
    self.nodegroup.selectAll("g circle").attr("fill", (d: any) => {
      const altChildren = d.data.altChildren || [];
      const { children } = d.data;
      return d.children ||
        (children && (children.length > 0 || altChildren.length > 0))
        ? "#18181b"
        : "#e11d48";
    });
  }, [self, data]);

  const renderMinimap = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    const minimapContainer = container.querySelector(".chart-minimap");
    self.minimapSvg = d3.select(minimapContainer)
      .html('')
      .style('width', `${self.minimapWidth}px`)
      .style('height', `${self.minimapHeight}px`)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [0, 0, self.width, self.height].join(' '));
    self.minimapChart = self.minimapSvg
      .append('g')
      .attr('class', 'chart-group')
      .attr('transform', `translate(${self.width / 2},${self.height / 2})`);
    self.gBrush = self.minimapSvg.append('g');
    self.minimapLinkgroup = self.minimapChart.append('g')
      .attr('fill', 'none')
      .attr("stroke", "#888")
      .attr('stroke-width', 1.5);

      self.minimapNodegroup = self.minimapChart.append('g')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', 3);

    const hierarchyData = d3.hierarchy(data);
    const root = self.tree(hierarchyData);

    const linksData = root.links();
    const nodesData = root.descendants().reverse();
    const miniLinks = self.minimapLinkgroup
      .selectAll('path')
      .data(linksData, (d: any) => `${d.source.data.name}_${d.target.data.name}`);
    miniLinks.exit().remove();
    const r: any = 0.1;
    const t: any = d3.transition()
      .duration(self.animationDuration)
      .ease(d3.easeLinear);
    miniLinks
      .enter()
      .append('path')
      .attr('d', d3.linkRadial()
        .angle((d: any) => d.x)
        .radius(r));
    const allMiniLinks = self.minimapLinkgroup.selectAll('path');
    allMiniLinks
      .transition(t)
      .attr('d', d3.linkRadial()
        .angle((d: any) => d.x)
        .radius((d: any) => d.y));
    const miniNodes = self.minimapNodegroup
      .selectAll('g')
      .data(nodesData, (d: any) => {
        if (d.parent) {
          return d.parent.data.name + d.data.name;
        }
        return d.data.name;
      });
    miniNodes.exit().remove();
    const newMiniNodes = miniNodes
      .enter().append('g');

    const allMiniNodes = self.minimapNodegroup.selectAll('g');
    allMiniNodes
      .attr('transform', (d: any) => `
        rotate(${(d.x * 180) / Math.PI - 90})
        translate(${d.y},0)
      `);
    newMiniNodes
    .append("circle").attr("r", 3).attr('stroke', '#e11d48').attr('stroke-width', 1.5);

      self.minimapNodegroup.selectAll('g circle').attr('fill', (d: any) => {
      const altChildren = d.data.altChildren || [];
      const { children } = d.data;
      return d.children || (children && (children.length > 0 || altChildren.length > 0)) ? '#555' : '#999';
    });
  }, [self, data]);

  const enableZoom = useCallback(() => {
    const onBrush = (event: any) => {
      if (event.sourceEvent && event.sourceEvent.type === 'zoom') return;
      const [[bx1, by1]] = event.selection;
      const zoomScale = d3.zoomTransform(self.panWrapper.node()).k;
      // console.log(event.sourceEvent);
      if (event.sourceEvent) {
        self.svg.call(
          self.zoom.transform,
          d3.zoomIdentity.translate(-bx1 * zoomScale, -by1 * zoomScale).scale(zoomScale)
        );
      }
      self.panWrapper.attr(...getTranslate(-bx1 * zoomScale, -by1 * zoomScale, zoomScale));
    };
    self.brush = d3.brush()
      .extent([[0, 0], [self.width, self.height]])
      .on('brush', onBrush);
    self.gBrush.call(self.brush);
    const onZoom = (event: any) => {
      // console.log(event.sourceEvent);
      const t = { ...event.transform };
      self.panWrapper.attr(...getTranslate(t.x, t.y, t.k));
      if (event.sourceEvent !== null || event.sourceEvent !== undefined) {
        // const [boxDimX, boxDimY] = [this.width / t.k, this.height / t.k];
        const [boxDimX, boxDimY] = [Math.min(self.viewportWidth, self.width) / t.k, self.viewportHeight / t.k];
        const [x1, y1] = [Math.min(Math.max(-t.x / t.k, 0), self.width - boxDimX), Math.min(Math.max(-t.y / t.k, 0), self.height - boxDimY)];
        self.brush.move(self.gBrush, [
          [x1, y1],
          [(x1 + boxDimX), (y1 + boxDimY)]
        ]);
      }
    };
    self.zoom = d3.zoom()
      .scaleExtent([1, 2])
      .translateExtent([[0, 0], [Math.max(self.width, self.viewportWidth), self.height]]) // world extent
      .extent([[0, 0], [self.viewportWidth, self.viewportHeight]]) // viewport extent
      .on('zoom', onZoom);
    self.svg
      .call(self.zoom);

      self.minimapSvg.selectAll('.handle').remove();
      self.minimapSvg.selectAll('.overlay').remove();
      self.brush.move(self.gBrush, [
      [0, 0],
      [Math.min(self.width, self.viewportWidth), self.viewportHeight]
    ]);
  }, [self]);

  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    const chartContainer = container.querySelector(".chart-wrapper");
    const minimapContainer = container.querySelector(".chart-minimap");
    if (!container || !chartContainer || !minimapContainer) return;
    self.svg = d3
      .select(chartContainer)
      .html('')
      .append("svg")
      .attr("width", "100%")
      .attr("height", self.viewportHeight);
    self.viewportWidth = container.offsetWidth || 800;
    self.panWrapper = self.svg.append("g");
    self.chart = self.panWrapper
      .append("g")
      .attr("transform", `translate(${self.width / 2},${self.height / 2})`);
    renderChart();
    renderMinimap();
    enableZoom();
  }, [self, renderChart, renderMinimap, enableZoom]);

  useEffect(() => {
    containerRef.current !== null && renderFunc();
  }, [renderFunc]);

  const resizeHandler = useCallback(() => {
    containerRef.current !== null && renderFunc();
  }, [renderFunc]);

  useResizeObserver(containerRef, resizeHandler);

  return (
    <div ref={containerRef} className="relative border border-zinc-500 overflow-hidden rounded-lg">
      <div className="chart-wrapper"></div>
      <div className="chart-minimap absolute top-4 right-4 border border-zinc-500 bg-black overflow-hidden rounded-lg"></div>
    </div>
  );
};

export default ChartUtil;
