"use client";
import React, { useCallback, useMemo, useRef, useEffect } from "react";
import * as d3 from "d3";

const BrandLogo = () => {
  const height = 512;
  const width = 512;

  const accentColors = useMemo(() => ["#06b6d4", "#e11d48"], []);
  const hoverColor = useMemo(() => ["#0c4a6e", "#9d174d"], []);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const renderPieChart = useCallback(
    (svg: any) => {
      const defs = svg.select("defs");
      defs
        .append("clipPath")
        .attr("id", "pie-clip-rect")
        .append("rect")
        .attr("x", -width / 2.22)
        .attr("y", -height / 2)
        .attr("width", width / 2.22)
        .attr("height", height)
        .attr("fill", "transparent");
      const pieChartGroup = svg
        .append("g")
        .attr("transform", `translate(${width / 2.22}, ${height / 2})`)
        .attr("class", "pie-chart-group")
        .attr("clip-path", "url(#pie-clip-rect)");

      const pieChartData: any[] = [
        { value: 25, radius: 16, fill: accentColors[0], fillHover: hoverColor[0] },
        { value: 10, radius: 0, fill: accentColors[1], fillHover: hoverColor[1] },
        { value: 15, radius: 8, fill: accentColors[0], fillHover: hoverColor[0] },
      ];
      const radius = height / 2 - 50;
      const arc: any = d3
        .arc()
        .innerRadius(radius - 20)
        .outerRadius((d: any) => radius + d.data.radius)
        .padAngle(0.025);
      const arcHover: any = d3
        .arc()
        .innerRadius(radius - 20)
        .outerRadius((d: any) => radius + d.data.radius + 10)
        .padAngle(0.025);
      const arcInner: any = d3
        .arc()
        .innerRadius(radius - 35)
        .outerRadius(radius - 30)
        .padAngle(0.03);
      const pie: any = d3
        .pie()
        .value((d: any) => d.value)
        .sort(null)
        .startAngle(0)
        .endAngle(-Math.PI);
      const pieGroup: any = pieChartGroup
        .selectAll("path")
        .data(pie(pieChartData))
        .enter()
        .append("g");

      pieGroup
        .append("path")
        .attr("d", arc)
        .attr("fill", (d: any) => d.data?.fill)
        .on('mouseenter', function(this: any) {
          d3.select(this)
            .transition()
            .duration(300)
            .attr('d', arcHover)
            .attr('fill', (d: any) => d.data?.fillHover);
        }).on('mouseleave', function(this: any) {
          d3.select(this)
            .transition()
            .duration(300)
            .attr('d', arc)
            .attr("fill", (d: any) => d.data?.fill) ;
        });
      pieChartGroup
        .append("g")
        .selectAll("path")
        .data(pie([pieChartData[0]]))
        .enter()
        .append("path")
        .attr("d", arcInner)
        .attr("fill", "#fff");

      const bubbleGroup = pieChartGroup
        .append("g")
        .attr("class", "bubble-chart-group");
      const bubbleRadius = radius / 2;
      bubbleGroup
        .append("circle")
        .attr('class', 'base-circle')
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", bubbleRadius)
        .attr("fill", "#353538");

      bubbleGroup
        .append("circle")
        .attr("cx", -bubbleRadius / 2.5)
        .attr("cy", -bubbleRadius / 4)
        .attr("r", bubbleRadius / 4)
        .attr("stroke-width", 4)
        .attr("stroke", accentColors[1])
        .attr("fill", "transparent")
        .on('mouseenter', function(this: any) {
          bubbleGroup.select('.base-circle')
            .transition()
            .duration(300)
            .attr('fill', '#0f172a')
          d3.select(this)
            .transition()
            .duration(300)
            .attr("stroke", hoverColor[1])
            .attr('fill', hoverColor[1]);
        }).on('mouseleave', function(this: any) {
          bubbleGroup.select('.base-circle')
            .transition()
            .duration(300)
            .attr('fill', '#353538')
          d3.select(this)
            .transition()
            .duration(300)
            .attr("stroke", accentColors[1])
            .attr("fill", 'transparent') ;
        });

      bubbleGroup
        .append("circle")
        .attr("cx", -bubbleRadius / 2)
        .attr("cy", bubbleRadius / 3)
        .attr("r", bubbleRadius / 8)
        .attr("stroke-width", 4)
        .attr("stroke", accentColors[0])
        .attr("fill", "transparent")
        .on('mouseenter', function(this: any) {
          bubbleGroup.select('.base-circle')
            .transition()
            .duration(300)
            .attr('fill', '#0f172a')
          d3.select(this)
            .transition()
            .duration(300)
            .attr("stroke", hoverColor[0])
            .attr('fill', hoverColor[0]);
        }).on('mouseleave', function(this: any) {
          bubbleGroup.select('.base-circle')
            .transition()
            .duration(300)
            .attr('fill', '#353538')
          d3.select(this)
            .transition()
            .duration(300)
            .attr("stroke", accentColors[0])
            .attr("fill", 'transparent') ;
        });

      bubbleGroup
        .append("circle")
        .attr("cx", -bubbleRadius / 40)
        .attr("cy", bubbleRadius / 3)
        .attr("r", bubbleRadius / 5)
        .attr("stroke-width", 4)
        .attr("stroke", accentColors[1])
        .attr("fill", "transparent")
        .on('mouseenter', function(this: any) {
          bubbleGroup.select('.base-circle')
            .transition()
            .duration(300)
            .attr('fill', '#0f172a')
          d3.select(this)
            .transition()
            .duration(300)
            .attr("stroke", hoverColor[1])
            .attr('fill', hoverColor[1]);
        }).on('mouseleave', function(this: any) {
          bubbleGroup.select('.base-circle')
            .transition()
            .duration(300)
            .attr('fill', '#353538')
          d3.select(this)
            .transition()
            .duration(300)
            .attr("stroke", accentColors[1])
            .attr("fill", 'transparent') ;
        });;
    },
    [height, width, accentColors, hoverColor]
  );

  const renderBarChart = useCallback(
    (svg: any) => {
      const barChartGroup = svg
        .append("g")
        .attr("transform", `translate(${width / 2.22}, ${0})`)
        .attr("class", "bar-chart-group");

      const barChartData: any[] = [
        { label: 1, value: 15 },
        { label: 2, value: 30 },
        { label: 3, value: 20 },
        { label: 4, value: 40 },
      ];

      const xOffset = 5,
        yOffset = 80;

      const axesLines = barChartGroup.append("g").attr("class", "axes-lines");
      axesLines
        .append("line")
        .attr("x1", xOffset)
        .attr("y1", height - yOffset)
        .attr("x2", xOffset)
        .attr("y2", yOffset)
        .attr("stroke", "#fff")
        .attr("stroke-width", 5);
      axesLines
        .append("line")
        .attr("x1", xOffset)
        .attr("y1", height - yOffset - 2.5)
        .attr("x2", height - 3 * yOffset + xOffset)
        .attr("y2", height - yOffset - 2.5)
        .attr("stroke", "#fff")
        .attr("stroke-width", 5);

      const xScale = d3
        .scaleBand()
        .domain(barChartData.map((d) => d.label))
        .range([0, height - 3 * yOffset + xOffset])
        .padding(0.4)
        .paddingOuter(0.55);
      const yScale = d3
        .scaleLinear()
        .domain([0, 80])
        .rangeRound([height - yOffset, yOffset]);

      const lineGen = d3
        .line()
        .x((d: any) => (xScale(d.label) ?? 0) + xScale.bandwidth() / 2)
        .y((d: any) => yScale(d.value + 10));
      barChartGroup
        .append("path")
        .attr('class', 'line-trace')
        .attr("d", lineGen(barChartData))
        .attr("fill", "none")
        .attr("stroke", accentColors[1])
        .attr("stroke-width", 4);

      const barGroups = barChartGroup.append("g").attr("class", "bar-group");
      const barRectGroup = barGroups
        .selectAll("rect.bar")
        .data(barChartData)
        .enter()
        .append("g");
      barRectGroup
        .append("rect")
        .attr("class", "bar")
        .attr("fill", accentColors[0])
        .attr("x", (d: any) => xScale(d.label) ?? 0)
        .attr("width", xScale.bandwidth())
        .attr("y", (d: any) => yScale(d.value))
        .attr("height", (d: any) => yScale(0) - yScale(d.value) - 10)
        .attr("rx", 6)
        .attr("ry", 6)
        .on('mouseenter', function(this: any) {
          d3.select(this)
            .transition()
            .duration(300)
            .attr("x", (d: any) => (xScale(d.label) ?? 0) - 4)
            .attr("width", xScale.bandwidth() + 8)
            .attr('fill', hoverColor[0]);
        }).on('mouseleave', function(this: any) {
          d3.select(this)
            .transition()
            .duration(300)
            .attr("x", (d: any) => (xScale(d.label) ?? 0))
            .attr("width", xScale.bandwidth())
            .attr('fill', accentColors[0]);
        });
      barRectGroup
        .append("circle")
        .attr("class", "market")
        .attr("stroke", accentColors[1])
        .attr("stroke-width", 4)
        .attr("fill", "#353538")
        .attr("r", 10)
        .attr("cx", (d: any) => (xScale(d.label) ?? 0) + xScale.bandwidth() / 2)
        .attr("cy", (d: any) => yScale(d.value + 10))
        .on('mouseenter', function(this: any) {
          barChartGroup
            .select('.line-trace')
            .transition()
            .duration(300)
            .attr("stroke", hoverColor[1])
          d3.select(this)
            .transition()
            .duration(300)
            .attr("stroke-width", 8)
            .attr('r', 14)
            .attr('stroke', hoverColor[1]);
        }).on('mouseleave', function(this: any) {
          barChartGroup
            .select('.line-trace')
            .transition()
            .duration(300)
            .attr("stroke", accentColors[1])
          d3.select(this)
            .transition()
            .duration(300)
            .attr("stroke-width", 4)
            .attr('r', 10)
            .attr('stroke', accentColors[1]);
        });
    },
    [height, width, accentColors, hoverColor]
  );

  const renderFunc = useCallback(() => {
    const container = containerRef.current as HTMLElement;
    if (!container) return;
    const svg = d3
      .select(container)
      .html("")
      .append("svg")
      .attr("viewBox", `${0} ${0} ${width} ${height}`);
    svg.append("defs");
    renderPieChart(svg);
    renderBarChart(svg);
  }, [height, width, renderPieChart, renderBarChart]);

  useEffect(() => {
    containerRef.current !== null && renderFunc();
  }, [renderFunc]);

  return <div ref={containerRef}></div>;
};

export default BrandLogo;
