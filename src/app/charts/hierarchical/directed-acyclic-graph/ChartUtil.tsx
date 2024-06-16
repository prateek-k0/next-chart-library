"use client";
import React, { useEffect, useCallback, useRef } from "react";
import * as d3 from "d3";
import { DataType, TreeNode } from "./data";

const ChartUtil = ({ data }: { data: DataType }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const configRef = useRef({
    width: 1600,
    height: 280,
    margin: {
      top: 25,
      bottom: 25,
      left: 0,
      right: 0,
    },
    svg: d3.select(null).append("svg") as d3.Selection<
      SVGSVGElement,
      unknown,
      Element | null,
      undefined
    >,
    chart: null as any,
    root: null as any,
    rawData: {} as DataType,
    nodeQMap: new Map<string, TreeNode>(),
    linkSet: new Set() as Set<string>,
    nodesOrdered: [] as TreeNode[],
    topY: 0,
    bottomY: 0,
    rebuiltTreeRoot: {} as TreeNode,
    nCols: 1,
    colWidth: 0,
    nodeColors: d3.schemeDark2,
    rectHeight: 48,
    colPadding: 40,
    levelOrderData: [] as string[][],
    transitionDuration: 300,
  });
  const self = configRef.current;

  function transformRawData() {
    self.nodeQMap.clear();
    self.linkSet.clear();
    self.rawData = data;
    // calculate total number of layers
    self.nCols = 0;
    const nodeList: TreeNode[] = [];
    // push data for dummy root
    const l1DataIds = self.rawData["level0"].map((n) => n.id);
    const progenitorNode: TreeNode = {
      id: "root",
      name: "root",
      depth: 0,
      next: [...l1DataIds],
      isCollapsed: false,
    };
    nodeList.push(progenitorNode);
    self.nodeQMap.set(progenitorNode.id, progenitorNode);
    // add column data from rawData
    Object.keys(self.rawData).forEach((key: string) => {
      self.rawData[key].forEach((node) => {
        const treeNode: TreeNode = { ...node, depth: 0, isCollapsed: false };
        nodeList.push(treeNode);
        self.nodeQMap.set(node.id, treeNode);
      });
    });
    // build tree layout
    [self.rebuiltTreeRoot] = nodeList;
    buildDAG(self.rebuiltTreeRoot);
  }

  function buildDAG(root: TreeNode, depth: number = 0, visited: { [prop: string]: boolean } = {}) {
    root.depth = depth;
    self.nCols = Math.max(self.nCols, depth + 1);
    root.next.forEach((nextId) => {
      self.linkSet.add(`${root.id}$${nextId}`);
      if (visited[nextId] !== true) {
        // if subtree not traversed already
        const childNode = self.nodeQMap.get(nextId);
        if (childNode) {
          buildDAG(childNode, depth + 1, visited);
        }
      }
    });
    visited[root.id] = true; // postorder-ly set the current subtree to traversed
  }

  function setLevelOrderData(
    root: TreeNode = self.rebuiltTreeRoot,
    visited: { [prop: string]: boolean } = {}
  ) {
    if (self.levelOrderData[root.depth].includes(root.id) === false)
      self.levelOrderData[root.depth].push(root.id);
    if (root.isCollapsed === true) return;
    root.next.forEach((childId) => {
      const child = self.nodeQMap.get(childId) as TreeNode;
      if (visited[child.id] !== true) {
        setLevelOrderData(child, visited);
      }
    });
    visited[root.id] = true;
  }

  function renderSVG() {
    const container = containerRef.current as HTMLElement;
    if (!container) return;
    self.colWidth = self.width / (self.nCols - 1 || 1);
    self.svg.remove();
    self.svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("width", "100%")
      .attr("viewBox", `0 0 ${self.width} ${self.height}`)
      .attr("class", "hierarchy-tree");
    self.chart = self.svg
      .append("g")
      .attr("class", "wrapper")
      .attr("transform", `translate(${self.margin.left},${self.margin.top + self.height / 2})`);
    self.chart.append("g").attr("class", "node-container");
    self.chart.append("g").attr("class", "link-container");
  }

  function storeDepthNodeData() {
    self.topY = 0;
    self.bottomY = 0;
    const nodeDim: number = self.rectHeight / 2;
    const nodePadding: number = self.rectHeight / 4;
    const maxTreeDepth: number = self.nCols + 1;
    for (let d = 0; d < maxTreeDepth; d++) {
      const mapLen: number = self.levelOrderData[d].length;
      for (let i = 0; i < self.levelOrderData[d].length; i++) {
        const node = self.nodeQMap.get(self.levelOrderData[d][i]);
        if (node !== undefined) {
          const yPos = (i - (mapLen - 1) / 2) * (2 * (nodeDim + nodePadding));
          self.topY = Math.min(self.topY, yPos);
          self.bottomY = Math.max(self.bottomY, yPos);
          node.y = yPos;
          node.x = self.colWidth * (d - 1);
        }
      }
    }
  }

  function renderNodes() {
    self.nodesOrdered = self.levelOrderData
      .flat()
      .map((nodeId) => self.nodeQMap.get(nodeId) as TreeNode);
    const nodeGroup = self.chart
      .select(".node-container")
      .selectAll("g.node")
      .data(self.nodesOrdered, (d: any) => d.id);
    nodeGroup.join(
      (enter: any) => {
        const nodeGroupItem = enter
          .append("g")
          .attr("class", "node")
          .attr(
            "transform",
            (d: any) =>
              `translate(${self.nodeQMap.get(d.id)?.x ?? 0},${self.nodeQMap.get(d.id)?.y ?? 0})`
          )
          .attr("opacity", (d: TreeNode) => (d.isCollapsed === false ? 1 : 0.33))
          .style('cursor', 'pointer');
        nodeGroupItem
          .append("rect")
          .attr("class", "nodeRect")
          .attr("x", self.colPadding)
          .attr("y", -self.rectHeight / 2)
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("width", self.colWidth - 2 * self.colPadding)
          .attr("height", self.rectHeight)
          .style("fill", (d: any) => self.nodeColors[d.depth - 1])
          .attr("stroke", (d: any) => self.nodeColors[d.depth - 1]);
        nodeGroupItem
          .append("foreignObject")
          .attr("width", self.colWidth - 2 * self.colPadding)
          .attr("height", self.rectHeight)
          .attr("x", self.colPadding)
          .attr("y", -self.rectHeight / 2)
          .append("xhtml:div")
          .attr(
            "style",
            `
                display: flex;
                width: 100%;
                height: 100%;
                align-items: center;
                justify-content: center;
              `
          )
          .append("div")
          .attr(
            "style",
            `
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                place-content: center;
                justify-content: center;
                max-width: 100%;
                max-height: 32px;
                line-height: 16px;
                font-family: 'Graphik';
                font-weight: 400;
                font-size: 12px;
                text-align: center;
                overflow: hidden;
                word-break: break-word;
                padding: 0 5px;
                color: #fff;
              `
          )
          .text((d: any) => d.name);
        nodeGroupItem.on("click", (event: any, d: TreeNode) => {
          if (d.depth === self.nCols - 1) {
            console.log("end col node");
            return;
          }
          console.log("collapse: ", d.id);
          collapseNode(d.id, !d.isCollapsed);
          updateLayout();
        });
        return nodeGroupItem;
      },
      (update: any) => {
        update
          .transition()
          .duration(self.transitionDuration)
          .attr(
            "transform",
            (d: any) =>
              `translate(${self.nodeQMap.get(d.id)?.x ?? 0},${self.nodeQMap.get(d.id)?.y ?? 0})`
          )
          .attr("opacity", (d: TreeNode) => (d.isCollapsed === false ? 1 : 0.33));
      },
      (exit: any) => {
        return exit.transition().duration(self.transitionDuration).attr("opacity", 0).remove();
      }
    );
  }

  function collapseNode(
    targetNodeId: string,
    collapse: boolean,
    node: TreeNode = self.rebuiltTreeRoot
  ) {
    if (node.id === targetNodeId) {
      const targetNode = self.nodeQMap.get(node.id) as TreeNode;
      targetNode.isCollapsed = collapse;
    } else {
      node.next.forEach((childId) =>
        collapseNode(targetNodeId, collapse, self.nodeQMap.get(childId) as TreeNode)
      );
    }
  }

  function renderLinks() {
    self.svg
      .append("defs")
      .append("marker")
      .attr("id", "end-arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 0)
      .attr("refY", 0)
      .attr("markerWidth", 11)
      .attr("markerHeight", 12)
      .attr("orient", "auto")
      .attr("class", "arrow")
      .attr("fill", "#fff")
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", "M0,-5L5,0L0,5");

    const linkGroup = self.chart
      .select(".link-container")
      .selectAll("path.link")
      .data(Array.from(self.linkSet) as string[], (d: string) => d);

    linkGroup.join(
      (enter: any) => {
        const linkGroupItem = enter
          .append("path")
          .attr("class", "link")
          .attr("fill", "none")
          .attr("stroke", "#fff")
          .attr("stroke-width", "1px")
          .attr("marker-end", "url(#end-arrow)")
          .attr("opacity", 0)
          .transition()
          .duration(self.transitionDuration)
          .attr("opacity", 0.5)
          .attr("d", (d: string) => diagonalDepthWise(d));
        return linkGroupItem;
      },
      (update: any) => {
        update
          .transition()
          .duration(self.transitionDuration)
          .attr("d", (d: string) => diagonalDepthWise(d));
        return update;
      },
      (exit: any) => {
        return exit.transition().duration(self.transitionDuration).attr("opacity", 0).remove();
      }
    );
  }

  function diagonalDepthWise(linkItem: string) {
    const [s, d] = linkItem.split("$");
    if (s === "root") return null;
    const sourceNode = self.nodeQMap.get(s);
    const destNode = self.nodeQMap.get(d);
    if (!sourceNode || !destNode) return null;
    if (sourceNode.isCollapsed === true) return null;
    if (self.levelOrderData[sourceNode.depth].includes(sourceNode.id) === false) return null;
    if (self.levelOrderData[destNode.depth].includes(destNode.id) === false) return null;
    const x1: number = (sourceNode?.x ?? 0) + self.colWidth - self.colPadding;
    const x2: number = (destNode?.x ?? 0) + self.colPadding - 5;
    const y1: number = sourceNode?.y ?? 0;
    const y2: number = destNode?.y ?? 0;
    const path = `M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`;
    return path;
  }

  function resetContainerHeight() {
    const graphHeight: number = self.bottomY - self.topY;
    const newHeight: number = graphHeight + self.margin.top + self.margin.bottom + self.rectHeight;
    self.height = newHeight;
    self.svg.attr("viewBox", `0 0 ${self.width} ${self.height}`);
    self.chart.attr(
      "transform",
      `translate(${0},${self.rectHeight / 2 + self.margin.top - self.topY})`
    );
  }

  function updateLayout() {
    self.levelOrderData = new Array(10).fill(null).map(() => new Array(0)); // max 10 layers
    setLevelOrderData();
    storeDepthNodeData();
    renderNodes();
    renderLinks();
    resetContainerHeight();
  }

  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;
    renderSVG();
    updateLayout();
  }, [data]);

  useEffect(() => {
    transformRawData();
  }, []);

  useEffect(() => {
    containerRef.current !== null && renderFunc();
  }, [renderFunc]);

  return <div ref={containerRef}></div>;
};

export default ChartUtil;
