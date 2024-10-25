import { DownOutlined } from "@ant-design/icons";
import data from "../data.json";
import issuelist from "../issuelist.json";
import "./App.css";
import { Drawer, Dropdown, Slider, Space } from "antd";
import { useState } from "react";
import ChoroplethMap from "./Choropleth";
import HorizontalBarChart from "./HorizontalBarChart";
import CantonDetails from "./CantonDetails";
import { topicKey, cantonKey, tsKey, mainMetric } from "./utils";
import { format } from "d3-format";

const topics = [...new Set(data.map((d) => d[topicKey]))];
const items = topics.map((d) => ({
  label: issuelist[d].en,
  key: d,
}));

const ts = [...new Set(data.map((d) => d[tsKey]))];

const sortedDates = ts.sort((a, b) => Number(a) - Number(b));
const sliderMarks = sortedDates.reduce((acc, date, index) => {
  acc[index] = date;
  return acc;
}, {});
const sliderMarkKeys = Object.keys(sliderMarks).map(Number);
const reducedSliderMarks = sliderMarkKeys
  .filter((_, index) => index % 2 === 0)
  .reduce((acc, key) => {
    acc[key] = sliderMarks[key];
    return acc;
  }, {});

function App() {
  const [topic, setTopic] = useState(items.at(0));
  const [ts, setTs] = useState(sliderMarks[0]);
  const [canton, setCanton] = useState(null);
  // const [hovered, setHovered] = useState(null);

  const onClick = ({ key }) => setTopic(items.find((d) => d.key === key));
  const onDrawerClose = () => setCanton(null);

  const mapData = data
    .filter((d) => d[topicKey] === topic.key && d[tsKey] === ts)
    .map((d) => ({
      name: d[cantonKey],
      value: d[mainMetric],
      meta: `State: ${d["num_bills_state"] || 0}<br/>Nation: ${
        d["num_bills_national"] || 0
      }`,
    }))
    .sort((a, b) => b.value - a.value);

  const drawerData = data.find(
    (d) =>
      d[topicKey] === topic.key &&
      d[tsKey] === ts &&
      d[cantonKey] === canton?.id
  );

  return (
    <>
      <section className="intro">
        <h1 className="title">Swiss Legislative Insights</h1>
        <p className="desc">
          The “Swiss Legislative Insights” dashboard offers an interactive way
          to explore legislative activities across Switzerland. It allows users
          to select specific legislative topic and filter data by year. A map of
          Switzerland displays the normalized number of submitted bills across
          cantons. Click on any canton to see detailed information about the
          legislative actions within that region, including the types of bills
          submitted, the involved parliament groups, and the individuals
          sponsoring or supporting the bills.
        </p>
      </section>

      <section className="config_container">
        <section className="dropdown">
          <Dropdown menu={{ items, onClick }} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                {topic.label}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
          <p className="dropText">{issuelist[topic.key].desc}</p>
        </section>

        <section className="slider">
          <Slider
            min={sliderMarkKeys.at(0)}
            max={sliderMarkKeys.at(-1)}
            marks={reducedSliderMarks}
            defaultValue={sliderMarkKeys.at(0)}
            onChange={(e) => setTs(sliderMarks[e])}
            tooltip={{ formatter: (e) => sliderMarks[e] }}
          />
        </section>
      </section>

      <section style={{ display: "flex", margin: "0 50px" }}>
        <ChoroplethMap data={mapData} onClick={setCanton} />

        <HorizontalBarChart
          data={mapData}
          valueFormat={(d) => format(".2f")(d)}
          onClick={setCanton}
        />

        <Drawer
          title="Canton Details"
          onClose={onDrawerClose}
          open={canton}
          width="40%"
        >
          <h1>{canton?.name}</h1>
          {drawerData && <CantonDetails data={drawerData} />}
        </Drawer>
      </section>
    </>
  );
}

export default App;
