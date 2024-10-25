/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { select } from "d3-selection";
import { scaleLinear, scaleBand, scaleOrdinal } from "d3-scale";
import { max } from "d3-array";
import { axisLeft } from "d3-axis";
import { stack, stackOffsetNone, stackOrderNone } from "d3-shape";
import "d3-transition";
import { schemeCategory10 } from "d3-scale-chromatic";

const StackedBarChart = ({
  data,
  width = 300,
  height = 600,
  margin = { top: 20, right: 30, bottom: 40, left: 100 },
  valueFormat,
  onClick,
  colorScale,
}) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const processedData = [];
    const groups = Array.from(new Set(data.map((d) => d.name)));
    const labels = Array.from(new Set(data.map((d) => d.label)));

    groups.forEach((group) => {
      const groupData = { group, sum: 0 };
      labels.forEach((label) => {
        const found = data.find((d) => d.name === group && d.label === label);
        const value = found ? found.value : 0;
        groupData[label] = value;
        groupData.sum += value;
      });
      processedData.push(groupData);
    });

    processedData.sort((a, b) => b.sum - a.sum);
    const stackKeys = labels;

    const stackedData = stack()
      .keys(stackKeys)
      .order(stackOrderNone)
      .offset(stackOffsetNone)(processedData);

    const y = scaleBand().domain(groups).range([0, chartHeight]).padding(0.1);

    const x = scaleLinear()
      .domain([0, max(stackedData, (d) => max(d, (d) => d[1]))])
      .range([0, chartWidth]);

    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.append("g").attr("class", "y-axis").call(axisLeft(y));

    const color =
      colorScale || scaleOrdinal().domain(stackKeys).range(schemeCategory10);

    const svgGroups = g
      .selectAll("g.series")
      .data(stackedData)
      .join("g")
      .attr("class", "series")
      .attr("fill", (d) => color(d.key));

    svgGroups
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("y", (d) => y(d.data.group))
      .attr("x", (d) => x(d[0]))
      .attr("width", (d) => x(d[1]) - x(d[0]))
      .attr("height", y.bandwidth())
      .on(
        "click",
        (event, d) =>
          onClick && onClick({ name: d.data.group, id: d.data.group })
      );

    svgGroups
      .selectAll(".label")
      .data((d) => d)
      .join("text")
      .attr("class", "label")
      .attr("x", (d) => x(d[0]) + (x(d[1]) - x(d[0])) / 2)
      .attr("y", (d) => y(d.data.group) + y.bandwidth() / 2 + 4)
      .attr("text-anchor", "middle")
      .text((d) =>
        d[1] - d[0] > 0
          ? valueFormat
            ? valueFormat(d[1] - d[0])
            : d[1] - d[0]
          : ""
      )
      .style("fill", "white")
      .style("font-size", 12)
      .style("pointer-events", "none");

    g.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("y", (d) => y(d.group) + y.bandwidth() / 2 + 4)
      .text((d) => (valueFormat ? valueFormat(d.count) : d.count))
      .each(function (d) {
        const textElement = select(this);
        const barWidth = x(d.count);
        const textWidth = textElement.node().getBBox().width;
        textElement.attr(
          "x",
          barWidth > textWidth + 10 ? barWidth - textWidth - 10 : barWidth + 5
        );
        textElement.attr("fill", barWidth > textWidth + 10 ? "white" : "black");
      })
      .style("font-size", 12)
      .style("pointer-events", "none");
  }, [data, height, margin, width, valueFormat, colorScale]);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default StackedBarChart;
