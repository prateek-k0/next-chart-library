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

  const configRef = useRef({
    svg: null as any,
    chart: null as any,
    width: 0,
    height: 1200,
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    nodeRadius: 12,
    nodeMap: new Map(),
    rightSecondaryCount: 0,
    leftSecondaryCount: 0,
    nodeSpaceMultiplier: 60,
    baseLinkSpace: 15,
    secondaryLinkSpace: 18,
    blurOpacity: 0.15,
    nodeStroke: "#ff3075",
    lineStroke: "#fff",
    lineStrokeHover: "#7602fa",
    nodeGroup: null as any,
    primaryLinkGroup: null as any,
    secondaryLinkGroup: null as any,
  });
  const self = configRef.current;

  const renderSVG = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;
    self.width = container.offsetWidth - (self.margin.left + self.margin.right);
    self.height = data.nodes.length * self.nodeSpaceMultiplier;
    console.log(self.height);
    self.svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("width", container.offsetWidth)
      .attr("height", self.height + self.margin.top + self.margin.bottom);
    self.chart = self.svg
      .append("g")
      .attr("class", "wrapper-group")
      .attr(
        "transform",
        `translate(${self.margin.left + self.width / 2}, ${self.margin.top})`
      );
  }, [self, data]);

  const transformData = useCallback(() => {
    data.nodes.forEach((node: any, index: number) => {
      self.nodeMap.set(node.id, { ...node, index });
    });
  }, [self, data]);

  const renderNodes = useCallback(() => {
    self.nodeGroup = self.chart
      .append("g")
      .attr("class", "nodes")
      .attr("transform", `translate(0, ${self.nodeSpaceMultiplier / 2})`)
      .selectAll("g.node-group")
      .data(data.nodes, (d: any) => d.id)
      .enter()
      .append("g")
      .attr("class", "node-group");
    self.nodeGroup
      .append("circle")
      .attr("cx", 0)
      .attr(
        "cy",
        (d: any) => self.nodeMap.get(d.id).index * self.nodeSpaceMultiplier
      )
      .attr("r", self.nodeRadius)
      .attr("stroke-width", 4)
      .attr("stroke", self.nodeStroke)
      .attr("fill", "#fff");
    self.nodeGroup
      .on("mouseenter", (event: any, d: any) => {
        const activeLinks = data.relationships.filter(
          (l: any) => l.source === d.id
        );
        const activeLinkSet = new Set(
          activeLinks.map((l: any) => `${l.source}$${l.target}`)
        );
        const activeNodes = activeLinks.map((l: any) => l.target).concat(d.id);
        self.nodeGroup
          .filter((n: any) => activeNodes.includes(n.id) === false)
          .attr("opacity", self.blurOpacity);
        self.primaryLinkGroup
          .filter((l: any) => !activeLinkSet.has(`${l.source}$${l.target}`))
          .attr("opacity", self.blurOpacity);
        self.secondaryLinkGroup
          .filter((l: any) => !activeLinkSet.has(`${l.source}$${l.target}`))
          .attr("opacity", self.blurOpacity);
      })
      .on("mouseleave", () => {
        self.nodeGroup.attr("opacity", 1);
        self.primaryLinkGroup.attr("opacity", 1);
        self.secondaryLinkGroup.attr("opacity", 1);
      });
  }, [self, data]);

  const renderLinks = useCallback(() => {
    self.svg
      .append("defs")
      .append("marker")
      .attr("id", "end-arrow")
      .attr("viewBox", "0 -5 20 20")
      .attr("refX", 0)
      .attr("refY", 0)
      .attr("markerWidth", 11)
      .attr("markerHeight", 12)
      .attr("orient", "auto")
      .attr("class", "arrow")
      .attr("fill", self.lineStroke)
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", "M0,-5L5,0L0,5");

    self.svg
      .append("defs")
      .append("marker")
      .attr("id", "end-arrow-medium")
      .attr("viewBox", "0 -5 30 30")
      .attr("refX", 0)
      .attr("refY", 0)
      .attr("markerWidth", 11)
      .attr("markerHeight", 12)
      .attr("orient", "auto")
      .attr("class", "arrow")
      .attr("fill", self.lineStroke)
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", "M0,-5L5,0L0,5");

    self.primaryLinkGroup = self.chart
      .append("g")
      .attr("class", "primary-links")
      .attr("transform", `translate(0, ${self.nodeSpaceMultiplier / 2})`)
      .selectAll("g.primary-link-group")
      .data(data.relationships.filter((link: any) => link.type === "primary"))
      .enter()
      .append("g")
      .attr("class", "primary-link-group");
    self.primaryLinkGroup
      .append("line")
      .attr("stroke-width", 2)
      .attr("stroke", self.lineStroke)
      .attr("marker-end", "url(#end-arrow)")
      .attr("x1", "0")
      .attr("x2", "0")
      .attr(
        "y1",
        (l: any) =>
          self.nodeRadius +
          self.nodeMap.get(l.source).index * self.nodeSpaceMultiplier +
          2
      )
      .attr(
        "y2",
        (l: any) =>
          self.nodeMap.get(l.target).index * self.nodeSpaceMultiplier -
          self.nodeRadius -
          7
      )
      .on("mouseenter", function (this: any, event: any, l: any) {
        d3.selectAll("g.primary-link-group line").attr(
          "opacity",
          self.blurOpacity
        );
        d3.selectAll("g.secondary-link-group path").attr(
          "opacity",
          self.blurOpacity
        );
        d3.selectAll("g.node-group")
          // .select('circle')
          .attr("opacity", self.blurOpacity);
        d3.selectAll("g.node-group")
          .filter((d: any) => d.id === l.source || d.id === l.target)
          // .select('circle')
          .attr("opacity", 1);
        d3.select(this).attr("opacity", 1).attr("stroke", self.lineStrokeHover);
      })
      .on("mouseleave", function (this: any) {
        d3.selectAll("g.primary-link-group line").attr("opacity", 1);
        d3.selectAll("g.secondary-link-group path").attr("opacity", 1);
        d3.selectAll("g.node-group")
          // .select('circle')
          .attr("opacity", 1);
        d3.select(this).attr("stroke", self.lineStroke);
      });

    self.secondaryLinkGroup = self.chart
      .append("g")
      .attr("class", "secondary-links")
      .attr("transform", `translate(0, ${self.nodeSpaceMultiplier / 2})`)
      .selectAll("g.secondary-link-group")
      .data(data.relationships.filter((link: any) => link.type === "secondary"))
      .enter()
      .append("g")
      .attr("class", "secondary-link-group");
    self.secondaryLinkGroup
      .append("path")
      .attr("stroke-width", 2)
      .attr("stroke", self.lineStroke)
      .attr("fill", "none")
      .attr("marker-end", "url(#end-arrow)")
      .attr("d", (l: any) => {
        const sourceNodeIndex = self.nodeMap.get(l.source).index;
        const sourcePoint = {
          x: self.nodeRadius,
          y: self.nodeMap.get(l.source).index * self.nodeSpaceMultiplier + 5,
        };
        const targetPoint = {
          x: self.nodeRadius + 7,
          y: self.nodeMap.get(l.target).index * self.nodeSpaceMultiplier - 5,
        };
        if (sourceNodeIndex % 2) {
          self.rightSecondaryCount += 1;
          return `M ${sourcePoint.x} ${sourcePoint.y} L ${
            self.baseLinkSpace +
            self.rightSecondaryCount * self.secondaryLinkSpace
          } ${sourcePoint.y} L ${
            self.baseLinkSpace +
            self.rightSecondaryCount * self.secondaryLinkSpace
          } ${targetPoint.y} L ${targetPoint.x} ${targetPoint.y}`;
        }
        self.leftSecondaryCount -= 1;
        return `M ${-sourcePoint.x} ${sourcePoint.y} L ${
          self.leftSecondaryCount * self.secondaryLinkSpace - self.baseLinkSpace
        } ${sourcePoint.y} L ${
          self.leftSecondaryCount * self.secondaryLinkSpace - self.baseLinkSpace
        } ${targetPoint.y} L ${-targetPoint.x} ${targetPoint.y}`;
      })
      .on("mouseenter", function (this: any, event: any, l: any) {
        d3.selectAll("g.primary-link-group line").attr(
          "opacity",
          self.blurOpacity
        );
        d3.selectAll("g.secondary-link-group path").attr(
          "opacity",
          self.blurOpacity
        );
        d3.selectAll("g.node-group")
          // .select('circle')
          .attr("opacity", self.blurOpacity);
        d3.selectAll("g.node-group")
          .filter((d: any) => d.id === l.source || d.id === l.target)
          // .select('circle')
          .attr("opacity", 1);
        d3.select(this)
          .attr("stroke-width", 3)
          .attr("marker-end", "url(#end-arrow-medium)")
          .attr("stroke", self.lineStrokeHover)
          .attr("opacity", 1);
      })
      .on("mouseleave", function (this: any) {
        d3.selectAll("g.primary-link-group line").attr("opacity", 1);
        d3.selectAll("g.secondary-link-group path").attr("opacity", 1);
        d3.selectAll("g.node-group")
          // .select('circle')
          .attr("opacity", 1);
        d3.select(this)
          .attr("stroke-width", 2)
          .attr("marker-end", "url(#end-arrow)")
          .attr("stroke", self.lineStroke);
      });
  }, [self, data]);

  const renderFunc = useCallback(() => {
    self.rightSecondaryCount = 0;
    self.leftSecondaryCount = 0;
    transformData();
    renderSVG();
    renderNodes();
    renderLinks();
  }, [self, transformData, renderSVG, renderNodes, renderLinks]);

  useEffect(() => {
    containerRef.current !== null && renderFunc();
  }, [renderFunc]);

  const resizeHandler = useCallback(() => {
    containerRef.current !== null && renderFunc();
  }, [renderFunc]);

  useResizeObserver(containerRef, resizeHandler);

  return <div ref={containerRef} className=""></div>;
};

export default ChartUtil;
