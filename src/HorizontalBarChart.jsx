/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { select } from "d3-selection";
import { scaleLinear, scaleBand } from "d3-scale";
import { max } from "d3-array";
import { axisLeft } from "d3-axis";
import "d3-transition";

const HorizontalBarChart = ({
  data,
  width = 300,
  height = 600,
  margin = { top: 20, right: 30, bottom: 40, left: 100 },
  valueFormat,
  onClick,
}) => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const svg = select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const tooltip = select(tooltipRef.current)
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("border-radius", "3px")
      .style("box-shadow", "0 0 5px rgba(0,0,0,0.2)");

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const x = scaleLinear()
      .domain([0, max(data, (d) => d.value)])
      .range([0, chartWidth]);

    const y = scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, chartHeight])
      .padding(0.1);

    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.append("g").attr("class", "y-axis").call(axisLeft(y));

    const bars = g
      .selectAll(".bar")
      .data(data)
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("class", "bar")
            .attr("y", (d) => y(d.name))
            .attr("height", y.bandwidth())
            .attr("x", 0)
            .attr("width", 0)
            .attr("fill", "#ff6536")
            .call((enter) =>
              enter.transition().attr("width", (d) => x(d.value))
            ),
        (update) =>
          update.call((update) =>
            update.transition().attr("width", (d) => x(d.value))
          ),
        (exit) => exit.remove()
      );

    bars
      .on("mouseenter", function (event, d) {
        select(this).attr("stroke", "white").attr("stroke-width", 2);
        tooltip
          .style("visibility", "visible")
          .text(`${d.name}: ${valueFormat ? valueFormat(d.value) : d.value}`);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", event.pageY + 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseleave", function () {
        select(this).attr("fill", "#ff6536").attr("stroke-width", 0);
        tooltip.style("visibility", "hidden");
      })
      .on(
        "click",
        (event, d) => onClick && onClick({ name: d.name, id: d.name })
      );

    g.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("y", (d) => y(d.name) + y.bandwidth() / 2 + 4)
      .text((d) => (valueFormat ? valueFormat(d.value) : d.value))
      .each(function (d) {
        const textElement = select(this);
        const barWidth = x(d.value);
        const textWidth = textElement.node().getBBox().width;
        textElement.attr(
          "x",
          barWidth > textWidth + 10 ? barWidth - textWidth - 10 : barWidth + 5
        );
        textElement.attr("fill", barWidth > textWidth + 10 ? "white" : "black");
      })
      .style("font-size", 12)
      .style("pointer-events", "none");
  }, [data, height, margin, width, valueFormat]);

  return (
    <div>
      <svg ref={svgRef}></svg>
      <div ref={tooltipRef} style={{ pointerEvents: "none" }}></div>
    </div>
  );
};

export default HorizontalBarChart;
