/* eslint-disable react/prop-types */
import { Descriptions, Divider } from "antd";
import { topicKey, tsKey } from "./utils";
import { scaleOrdinal } from "d3-scale";
import { schemeSet2 } from "d3-scale-chromatic";
import { ManOutlined, WomanOutlined } from "@ant-design/icons";
import StackedBarChart from "./StackedBarChart";
import g_bills from "../grouped_bills_with_topics.json";

const CantonDetails = ({ data, canton }) => {
  const num_national = data["num_bills_national"];
  const num_state = data["num_bills_state"];
  const num_sum = (num_national || 0) + (num_state || 0);
  const bill_group = g_bills.find(
    (d) =>
      d.canton === canton &&
      d.issue === data.issue &&
      d.bill_year.toString() === data.year
  );

  const colorScale = scaleOrdinal(schemeSet2).domain(
    data?.bill_data?.map((d) => d.label)
  );
  const items = [
    {
      key: 0,
      label: "Year",
      children: data[tsKey],
    },
    {
      key: 1,
      label: "Issue",
      children: data[topicKey],
    },
    {
      key: 2,
      label: "Bills",
      children: num_sum,
    },
  ];

  return (
    <section>
      <p dangerouslySetInnerHTML={{ __html: bill_group?.analyzed_topics }} />
      <Descriptions layout="horizontal" items={items} />
      <TagList items={data?.bill_data} colorScale={colorScale} />
      <Divider orientation="left" style={{ color: "#ccc", fontSize: 14 }}>
        Parliamentary Groups
      </Divider>
      <StackedBarChart
        width={400}
        height={200}
        margin={{ top: 20, right: 30, bottom: 40, left: 200 }}
        data={data?.group_data
          .map((d) => ({ name: d.group, value: d.count, label: d.label }))
          .sort((a, b) => b.value - a.value)}
        valueFormat={(d) => d}
        colorScale={colorScale}
      />
      <Divider orientation="left" style={{ color: "#ccc", fontSize: 14 }}>
        Parliament Person Activity
      </Divider>
      <section style={{ padding: "0 10px" }}>
        {data?.top_persons
          .sort((a, b) => b.count - a.count)
          .map((p) => (
            <Person key={p.id} p={p} />
          ))}
      </section>
    </section>
  );
};

export default CantonDetails;

const Person = ({ p }) => (
  <section style={{ display: "flex", gap: 5 }}>
    <p style={{ marginTop: 0 }}>
      {p?.first_name} {p?.last_name}
    </p>
    <p style={{ marginTop: 0 }}>
      {p?.gender === "m" ? (
        <ManOutlined style={{ fontSize: 16, color: "#08c" }} />
      ) : p?.gender === "f" ? (
        <WomanOutlined style={{ fontSize: 16, color: "#ff8da1" }} />
      ) : null}
    </p>
    <p style={{ marginTop: 0 }}>{p?.native_language}</p>
    {p?.count != null && (
      <p style={{ marginTop: 0, color: "#aaa" }}>{p.count} bills</p>
    )}
  </section>
);

const Tag = ({ label, count, color }) => {
  return (
    <div
      style={{
        display: "inline-block",
        margin: "5px",
        padding: "5px 8px",
        backgroundColor: color,
        color: "white",
        borderRadius: "20px",
        fontSize: "10px",
        fontWeight: "bold",
      }}
    >
      <span>{label}</span>
      <span style={{ marginLeft: "10px", opacity: 0.8 }}>{count}</span>
    </div>
  );
};

const TagList = ({ items, colorScale }) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", margin: "20px auto" }}>
      {items
        .sort((a, b) => b.count - a.count)
        .map((item, index) => (
          <Tag
            key={index}
            label={item.label}
            count={item.count}
            color={colorScale(item.label)}
          />
        ))}
    </div>
  );
};
