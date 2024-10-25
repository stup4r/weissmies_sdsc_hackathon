/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { scaleSequential } from "d3-scale";
import { interpolateBlues } from "d3-scale-chromatic";
import { select } from "d3-selection";
import * as topojson from "topojson-client";
import topology from "../ch-cantons.topojson.json";
import { max } from "d3-array";

const ChoroplethMap = ({ data, onClick }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const geometries = topology.objects.cantons.geometries;

  useEffect(() => {
    const width = 960;
    const height = 600;

    const colorExtent = [0, max(data, (d) => d.value)];
    // const colorExtent = extent(data, (d) => d.value);

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

    const projection = geoMercator().fitSize(
      [width, height],
      topojson.feature(topology, topology.objects.cantons)
    );
    const path = geoPath().projection(projection);

    const cantonsData = geometries.map((canton) => ({
      name: canton.properties.name,
      value: data.find((d) => d.name === canton.id)?.value ?? 0,
      meta: data.find((d) => d.name === canton.id)?.meta ?? null,
    }));

    const colorScale = scaleSequential(interpolateBlues).domain(colorExtent);
    const cantonsGeoJSON = topojson.feature(topology, topology.objects.cantons);

    svg
      .selectAll("path")
      .data(cantonsGeoJSON.features)
      .join("path")
      .attr("d", path)
      .attr("fill", (d) => {
        const cantonData = cantonsData.find(
          (canton) => canton.name === d.properties.name
        );
        return cantonData.value ? colorScale(cantonData.value) : "#eee";
      })
      .attr("stroke", "#333")
      .attr("stroke-width", 0.5)
      .on("click", (event, d) => onClick({ name: d.properties.name, id: d.id }))
      .on("mouseover", function (event, d) {
        const cantonData = cantonsData.find(
          (canton) => canton.name === d.properties.name
        );
        select(event.currentTarget).attr("stroke-width", 2);

        tooltip
          .style("visibility", "visible")
          .html(
            `<strong>${
              d.properties.name
            }</strong><br/>Value: ${cantonData?.value?.toFixed(2)}<br/>${
              cantonData?.meta ? cantonData?.meta : ""
            }`
          );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", event.pageY + 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
        select(event.currentTarget).attr("stroke-width", 0.5);
      });
  }, [data]);

  return (
    <div>
      <svg ref={svgRef}></svg>
      <div ref={tooltipRef} style={{ pointerEvents: "none" }}></div>
    </div>
  );
};

export default ChoroplethMap;
