import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartDataType } from "../../../data/chartData";

interface Props {
  data: ChartDataType[];
}

const LineChartObject: React.FC<Props> = ({ data }) => {
  return (
    <div style={{ height: 250, width: 900, marginLeft: -30 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={300}
          height={250}
          data={data}
          margin={{
            top: 20,
            bottom: 20,
            left: 20,
            right: 20,
          }}
        >
          <XAxis dataKey="day" stroke="#C0C0C0" />
          <YAxis
            tickCount={40}
            axisLine={false}
            tickLine={false}
            stroke="#C0C0C0"
          />
          <Tooltip />
          <Line type="monotone" dataKey="minutes" stroke="#4cbb17" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartObject;
