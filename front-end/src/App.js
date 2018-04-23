import React, { Component } from "react";
import logo from "./logo.svg";
import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  linearGradient,
  ComposedChart,
  Line,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import moment from "moment";

var createReactClass = require("create-react-class");

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      graph: [],
      lastUpdated: 0
    };
  }
  componentDidMount() {
    fetch("https://deweybike.firebaseapp.com/readings")
      .then(function(response) {
        return response.json();
      })
      .then(json => {
        var data = [];
        var graph = [];
        for (var key in json) {
          if (json.hasOwnProperty(key)) {
            if (json[key]["id"] == 0)
              data.push(parseInt(json[key]["measurement"]));
            graph.push({
              x: json[key]["date"],
              y: parseInt(json[key]["measurement"])
            });
          }
        }
        var lastUpdated = moment
          .utc(graph[graph.length - 1]["x"])
          .local()
          .format("MMMM Do YYYY, h:mm a");
        this.setState({ data: data, graph: graph, lastUpdated: lastUpdated });
      });
  }
  render() {
    const data = this.state.data;
    const graph = this.state.graph;
    const lastUpdated = this.state.lastUpdated;

    const CustomizedAxisTick = createReactClass({
      render() {
        const { x, y, stroke, payload } = this.props;

        return (
          <g transform={`translate(${x},${y})`}>
            <text
              x={0}
              y={0}
              dy={16}
              textAnchor="end"
              fill="#666"
              transform="rotate(-45)"
            >
              {moment
                .utc(payload.value)
                .local()
                .format("MMMM Do YYYY, h:mm a")}
            </text>
          </g>
        );
      }
    });

    return (
      <section className="section">
        <div className="container">
          {data[data.length - 1] < 2500 ? (
            <div>
              <section className="hero is-primary">
                <div className="hero-body">
                  <div className="container">
                    <h1 className="title">Trail is currently open.</h1>
                    <p> Last updated: {lastUpdated}</p>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div>
              <section className="hero is-danger">
                <div className="hero-body">
                  <div className="container">
                    <h1 className="title">Trail is currently closed.</h1>
                    <p> Last updated: {lastUpdated}</p>
                  </div>
                </div>
              </section>
            </div>
          )}
          <ResponsiveContainer width="95%" height={500}>
            <ComposedChart
              data={graph}
              margin={{ top: 5, right: 30, left: 50, bottom: 120 }}
            >
              <XAxis
                dataKey="x"
                domain={["auto", "auto"]}
                name="Time"
                tick={<CustomizedAxisTick />}
                interval={1}
              />
              <YAxis domain={["auto", "auto"]} />
              <ReferenceLine y={2500} label="Cutoff" stroke="red" />

              <CartesianGrid strokeDasharray="3 3" />
              <Legend verticalAlign="top" />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="y"
                stroke="#0f54ec"
                strokeWidth={5}
                name="Moisture"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>
    );
  }
}

export default App;
