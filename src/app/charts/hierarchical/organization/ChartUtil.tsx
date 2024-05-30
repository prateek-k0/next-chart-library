"use client";
import React, { useEffect, useCallback, useRef } from "react";
import * as d3 from "d3";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { DataItemType, DataType, TreeNode } from "./data";

const plusIcon = `<svg
fill="currentColor"
viewBox="0 0 16 16"
height="20px"
width="20px"
style="cursor: pointer;"
> <circle cx="8" cy="8" r="8" stroke-width="0" fill="black"></circle>
<path d="M8 15A7 7 0 118 1a7 7 0 010 14zm0 1A8 8 0 108 0a8 8 0 000 16z" />
<path d="M8 4a.5.5 0 01.5.5v3h3a.5.5 0 010 1h-3v3a.5.5 0 01-1 0v-3h-3a.5.5 0 010-1h3v-3A.5.5 0 018 4z" />
</svg>`;

const minusIcon = `<svg
fill="currentColor"
viewBox="0 0 16 16"
height="20px"
width="20px"
style="cursor: pointer;"
> <circle cx="8" cy="8" r="8" stroke-width="0" fill="black"></circle>
<path d="M8 15A7 7 0 118 1a7 7 0 010 14zm0 1A8 8 0 108 0a8 8 0 000 16z" />
<path d="M 8 7.5 h 3 a 0.5 0.5 0 0 1 0 1 h -3 v 0 h -3 a 0.5 0.5 0 0 1 0 -1 h 3 z" />
</svg>`;

const ChartUtil = ({ data }: { data: DataType }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const configRef = useRef({
    width: 0,
    height: 0,
    nodeQMap: new Map() as Map<string, TreeNode>,
    treeNodeQMap: new Map(),
    linkSet: new Set() as Set<string>,
    treeRoot: null as any,
    rebuiltTreeRoot: undefined as TreeNode | undefined,
    colWidth: 0,
    topY: 0,
    bottomY: 0,
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
    nCols: 0,
    nodesOrdered: [] as any,
    colPadding: 75,
    rectHeight: 45,
    accentColor: "#00bbff",
    transitionDuration: 300,
  });
  const self = configRef.current;

  const buildTree = useCallback(
    (
      node: TreeNode,
      depth: number = 0,
      visited: { [prop: string]: boolean } = {}
    ) => {
      node._children = [];
      node.collapsed = false;
      self.nCols = Math.max(self.nCols, depth + 1);
      node.next.forEach((childId) => {
        if (self.nodeQMap.has(childId)) {
          // only if the node is present in the data
          if (!visited[childId]) {
            const childNode = self.nodeQMap.get(childId);
            if (childNode !== undefined) {
              node.children = (node.children ?? []).concat(childNode);
              buildTree(childNode, depth + 1, visited);
            }
          }
        }
      });
      visited[node.id] = true; // postorder, needed for DAG
    },
    [self]
  );

  const transformData = useCallback(() => {
    self.nodeQMap.clear();
    Object.keys(data).forEach((col, colIndex) => {
      (data[col] as DataItemType[]).forEach((item: DataItemType, itemIndex) => {
        self.nodeQMap.set(item.id, {
          ...item,
          children: [],
          _children: [],
          collapsed: false,
        } as TreeNode);
        if (colIndex === 0 && itemIndex === 0) {
          self.rebuiltTreeRoot = {
            ...item,
            children: [],
            _children: [],
            collapsed: false,
          };
        }
      });
    });
    if (self.rebuiltTreeRoot !== undefined) buildTree(self.rebuiltTreeRoot);
  }, [self, data, buildTree]);

  const getTreeLinks = useCallback(
    (
      node: d3.HierarchyPointNode<TreeNode>,
      visited: { [prop: string]: boolean } = {}
    ) => {
      if (node.children) {
        node.children.forEach((child) => {
          if (!visited[child.data.id]) {
            self.linkSet.add(`${node.data.id}$${child.data.id}`);
            getTreeLinks(child);
          }
        });
        visited[node.data.id] = true;
      }
    },
    [self]
  );

  const expandOrCollapseSubtree = useCallback(
    (node: TreeNode, targetNodeId: string, collapse: boolean = true) => {
      if (node.id === targetNodeId) {
        if (collapse) {
          node._children = [...node.children];
          node.children = [];
          node.collapsed = true;
        } else {
          node.children = [...node._children];
          node._children = [];
          node.collapsed = false;
        }
      } else {
        node.children.forEach((child) =>
          expandOrCollapseSubtree(child, targetNodeId, collapse)
        );
      }
    },
    []
  );

  const renderNodes = useCallback(() => {
    const rectWidth = Math.max(self.colWidth - self.colPadding * 2, 0);
    const expandButtonDim = 20;
    self.chart
      .select(".node-container")
      .selectAll(".node")
      .data(self.nodesOrdered, (d: any) => d.data.id)
      .join(
        (enter: any) => {
          const nodeGroup = enter.append("g").attr("class", "node");
          nodeGroup
            .attr("transform", (d: any) =>
              d.parent !== null
                ? `translate(${d.parent.x},${d.parent.y})`
                : `translate(${0},${0})`
            )
            .attr("opacity", 0)
            .transition()
            .duration(self.transitionDuration)
            .attr("transform", (d: any) => `translate(${d.x},${d.y})`)
            .attr("opacity", 1);
          nodeGroup
            .append("rect")
            .attr("x", self.colPadding)
            .attr("y", -self.rectHeight / 2)
            .attr("width", rectWidth)
            .attr("height", self.rectHeight)
            .attr("stroke", self.accentColor)
            .attr("fill", "transparent");
          nodeGroup
            .append("foreignObject")
            .attr("x", self.colPadding)
            .attr("y", -self.rectHeight / 2)
            .attr("width", rectWidth)
            .attr("height", self.rectHeight)
            .attr("class", "node-name")
            .append("xhtml:div")
            .attr(
              "style",
              `
              display: flex;
              align-items: center;
              height: ${self.rectHeight}px;
              justify-content: center;
            `
            )
            .append("xhtml:div")
            .attr(
              "style",
              `
              font-size: 14px;
              font-family: "Graphik";
              padding: 0 5px;
              line-height: ${self.rectHeight / 2}px;
              max-height: ${self.rectHeight}px;
              -webkit-box-orient: vertical;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              overflow: hidden;
              text-overflow: ellipsis;
            `
            )
            .html((d: any) => d.data.name);

          const expandTrigger = nodeGroup
            .append("g")
            .attr("class", "expand-trigger")
            .style("cursor", "pointer");
          expandTrigger
            .append("line")
            .attr("x1", self.colWidth - self.colPadding)
            .attr("x2", (d: any) =>
              d.data.collapsed
                ? self.colWidth - self.colPadding / 2
                : self.colWidth
            )
            .attr("y1", 0)
            .attr("y2", 0)
            .attr("stroke", self.accentColor);
          expandTrigger
            .append("g")
            .attr(
              "transform",
              (d: any) =>
                `translate(${
                  (d.data.collapsed
                    ? self.colWidth - self.colPadding / 2
                    : self.colWidth) -
                  expandButtonDim / 2
                },${-expandButtonDim / 2})`
            )
            .html((d: any) => (d.data.collapsed ? plusIcon : minusIcon))
            .select("svg")
            .attr("fill", self.accentColor);
          expandTrigger.on("click", (event: any, d: any) => {
            if (self.rebuiltTreeRoot !== undefined) {
              expandOrCollapseSubtree(
                self.rebuiltTreeRoot,
                d.data.id,
                !d.data.collapsed
              );
              updateLayout();
            }
          });
          expandTrigger.each((d: any, i: number, nodes: any[]) => {
            if (d.data.children.length === 0 && d.data._children.length === 0) {
              d3.select(nodes[i]).style("visibility", "hidden");
            }
          });
          return nodeGroup;
        },
        (update: any) => {
          update
            .transition()
            .duration(self.transitionDuration)
            .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
          update
            .select(".expand-trigger")
            .select("g")
            .attr(
              "transform",
              (d: any) =>
                `translate(${
                  (d.data.collapsed
                    ? self.colWidth - self.colPadding / 2
                    : self.colWidth) -
                  expandButtonDim / 2
                },${-expandButtonDim / 2})`
            )
            .html((d: any) => (d.data.collapsed ? plusIcon : minusIcon))
            .select("svg")
            .attr("fill", self.accentColor);
          update
            .select(".expand-trigger")
            .select("line")
            .attr("x2", (d: any) =>
              d.data.collapsed
                ? self.colWidth - self.colPadding / 2
                : self.colWidth
            );
          return update;
        },
        (exit: any) => {
          exit
            .transition()
            .duration(self.transitionDuration)
            .attr("transform", (d: any) =>
              d.parent !== null
                ? `translate(${d.parent.x},${d.parent.y})`
                : `translate(${0},${0})`
            )
            .attr("opacity", 0)
            .remove();
          return exit;
        }
      );
  }, [self, expandOrCollapseSubtree]);

  function renderLinks() {
    const links = Array.from(self.linkSet) as string[];
    const rectWidth = Math.max(self.colWidth - self.colPadding * 2, 0);
    self.chart
      .select(".link-container")
      .selectAll(".link")
      .data(links, (d: any) => d)
      .join(
        (enter: any) => {
          const linkGroup = enter.append("g").attr("class", "link");
          linkGroup
            .append("polyline")
            .attr("stroke", self.accentColor)
            .attr("fill", "none")
            .transition()
            .duration(self.transitionDuration)
            .attr("points", (d: any) => {
              const [source, target] = d.split("$");
              const sourceNode = self.treeNodeQMap.get(source);
              const targetNode = self.treeNodeQMap.get(target);
              if (!sourceNode || !targetNode) return "";
              const points = `
              ${sourceNode.x + self.colPadding + rectWidth} ${sourceNode.y},
              ${sourceNode.x + 2 * self.colPadding + rectWidth} ${sourceNode.y},
              ${sourceNode.x + 2 * self.colPadding + rectWidth} ${targetNode.y},
              ${targetNode.x + self.colPadding},${targetNode.y}
            `;
              return points;
            });
          return linkGroup;
        },
        (update: any) => {
          update
            .select("polyline")
            .attr("stroke", "transparent")
            .transition()
            .duration(self.transitionDuration)
            .attr("stroke", self.accentColor)
            .attr("points", (d: any) => {
              const [source, target] = d.split("$");
              const sourceNode = self.treeNodeQMap.get(source);
              const targetNode = self.treeNodeQMap.get(target);
              if (!sourceNode || !targetNode) return "";
              const points = `
            ${sourceNode.x + self.colPadding + rectWidth} ${sourceNode.y},
            ${sourceNode.x + 2 * self.colPadding + rectWidth} ${sourceNode.y},
            ${sourceNode.x + 2 * self.colPadding + rectWidth} ${targetNode.y},
            ${targetNode.x + self.colPadding},${targetNode.y}
          `;
              return points;
            });
          return update;
        },
        (exit: any) => {
          return exit
            .transition()
            .duration(self.transitionDuration)
            .attr("opacity", 0)
            .remove();
        }
      );
  }

  function updateLayout() {
    self.topY = 0;
    self.bottomY = 0;
    self.treeNodeQMap.clear();
    self.linkSet.clear();
    self.treeRoot = d3.hierarchy(self.rebuiltTreeRoot);
    const treeMap = d3
      .tree<TreeNode>()
      .nodeSize([self.rectHeight * 2, self.colWidth])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2));
    const treeDatain = treeMap(self.treeRoot);
    getTreeLinks(treeDatain);
    self.nodesOrdered = treeDatain.descendants();
    self.nodesOrdered.forEach((node: any) => {
      // for horizontal layout
      [node.x, node.y] = [node.y, node.x];
      self.topY = Math.min(self.topY, node.y);
      self.bottomY = Math.max(self.bottomY, node.y);
      self.treeNodeQMap.set(node.data.id, node);
      node.id = node.data.id;
    });
    renderLinks();
    renderNodes();
    resetContainerHeight();
  }

  function resetContainerHeight() {
    const graphHeight: number = self.bottomY - self.topY + self.rectHeight;
    const newHeight: number =
      graphHeight + self.margin.top + self.margin.bottom + self.rectHeight / 2;
    self.height = graphHeight;
    self.svg.attr("height", newHeight);
    self.chart.attr(
      "transform",
      `translate(${0},${self.rectHeight / 2 + self.margin.top - self.topY})`
    );
  }

  function renderSVG() {
    const container = containerRef.current as HTMLElement;
    if (!container) return;
    self.width = container.offsetWidth - self.margin.left - self.margin.right;
    self.colWidth = self.width / (self.nCols || 1);
    self.svg.remove();
    self.svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("width", container.offsetWidth)
      .attr("height", self.height + self.margin.top + self.margin.bottom)
      .attr("class", "hierarchy-tree");
    self.chart = self.svg
      .append("g")
      .attr("class", "wrapper")
      .attr(
        "transform",
        `translate(${self.margin.left},${self.margin.top + self.height / 2})`
      );
    self.chart.append("g").attr("class", "link-container");
    self.chart.append("g").attr("class", "node-container");
  }

  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;
    renderSVG();
    updateLayout();
  }, [data, transformData]);

  useEffect(() => {
    transformData();
  }, [transformData]);

  useEffect(() => {
    containerRef.current !== null && renderFunc();
  }, [renderFunc]);

  const resizeHandler = useCallback(() => {
    containerRef.current !== null && renderFunc();
  }, [renderFunc]);

  useResizeObserver(containerRef, resizeHandler);

  return <div ref={containerRef}></div>;
};

export default ChartUtil;
