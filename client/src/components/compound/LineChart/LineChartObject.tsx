import React from "react";
import styles from "./LineChartObject.module.scss";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartDataType } from "../../../data/chartData";
import { useLanguage } from "../../../context/LanguageProvider";

interface Props {
  data: ChartDataType[];
}

const LineChartObject: React.FC<Props> = ({ data }) => {
  const { t } = useLanguage();
  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
          <Line
            type="monotone"
            dataKey="minutes"
            stroke="#4cbb17"
            name={t("minutes")}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartObject;
