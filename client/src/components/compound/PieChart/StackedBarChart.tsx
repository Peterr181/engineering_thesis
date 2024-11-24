import React from "react";
import styles from "./StackedBarChart.module.scss";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useLanguage } from "../../../context/LanguageProvider";

interface DataItem {
  name: string;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
}

interface PieChartProps {
  data: DataItem[];
  onMouseOver: (data: { activePayload?: { payload: DataItem }[] }) => void;
}

const StackedBarChart: React.FC<PieChartProps> = ({ data, onMouseOver }) => {
  const { t } = useLanguage();

  return (
    <div className={styles.pieChart}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          onMouseMove={(data) => onMouseOver(data || { activePayload: [] })}
          onMouseLeave={() => onMouseOver({ activePayload: [] })}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="protein"
            stackId="a"
            fill="#8884d8"
            name={t("protein")}
          />
          <Bar dataKey="carbs" stackId="a" fill="#82ca9d" name={t("carbs")} />
          <Bar dataKey="fats" stackId="a" fill="#FF8042" name={t("fats")} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedBarChart;
