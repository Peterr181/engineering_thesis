import { PureComponent } from "react";
import styles from "./GoalsComprasionChart.module.scss";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface GoalsComparisonChartProps {
  personalInfoData: { label: string; value: number }[];
  dailySettings: {
    calories_eaten: number;
    steps_taken: number;
    water_consumed: number;
    sleep_duration: number;
    created_at: string;
  }[];
  view: string;
  weekMetric: string;
  language: string;
  currentMonth: number;
}

interface GoalsComparisonChartState {
  goalsData: {
    metric?: string;
    actual?: number;
    goal?: number;
    day?: number;
  }[];
}

export default class GoalsComparisonChart extends PureComponent<
  GoalsComparisonChartProps,
  GoalsComparisonChartState
> {
  constructor(props: GoalsComparisonChartProps) {
    super(props);
    this.state = {
      goalsData: [],
    };
  }

  componentDidMount() {
    this.updateGoalsData();
  }

  metricActual(
    dailySetting: {
      calories_eaten: number;
      steps_taken: number;
      water_consumed: number;
      sleep_duration: number;
      created_at: string;
    },
    metric: string
  ): number {
    switch (metric) {
      case "calories":
        return dailySetting.calories_eaten || 0;
      case "steps":
        return dailySetting.steps_taken || 0;
      case "water":
        return dailySetting.water_consumed || 0;
      case "sleep":
        return dailySetting.sleep_duration || 0;
      default:
        return 0;
    }
  }

  metricGoal(
    personalInfoData: { label: string; value: number }[],
    metric: string
  ): number {
    const goal = personalInfoData.find(
      (item) => item.label === `${metric}_goal`
    );
    if (goal) {
      return goal.value;
    }
    switch (metric) {
      case "calories":
        return 3000;
      case "steps":
        return 10000;
      case "water":
        return 3.0;
      case "sleep":
        return 8;
      default:
        return 0;
    }
  }

  componentDidUpdate(prevProps: GoalsComparisonChartProps) {
    if (
      prevProps.view !== this.props.view ||
      prevProps.weekMetric !== this.props.weekMetric ||
      prevProps.dailySettings !== this.props.dailySettings
    ) {
      this.updateGoalsData();
    }
  }

  updateGoalsData() {
    const { personalInfoData, dailySettings, view, weekMetric, currentMonth } =
      this.props;
    let goalsData:
      | { day: number; actual: number; goal: number }[]
      | { metric: string; actual: number; goal: number }[] = [];

    if (view === "today") {
      const today = new Date().toISOString().split("T")[0];
      const latestDailySetting = dailySettings.find(
        (setting) => setting.created_at.split("T")[0] === today
      ) || {
        calories_eaten: 0,
        steps_taken: 0,
        water_consumed: 0,
        sleep_duration: 0,
        created_at: "",
      };
      goalsData = [
        {
          metric: "Calories (Kalorie)",
          actual: latestDailySetting.calories_eaten || 0,
          goal:
            personalInfoData.find(
              (item) => item.label === "caloric_intake_goal"
            )?.value || 3000,
        },
        {
          metric: "Steps (Kroki)",
          actual: latestDailySetting.steps_taken || 0,
          goal:
            personalInfoData.find((item) => item.label === "steps_daily")
              ?.value || 10000,
        },
        {
          metric: "Water (Woda)",
          actual: latestDailySetting.water_consumed || 0,
          goal:
            personalInfoData.find((item) => item.label === "water_drunk_daily")
              ?.value || 3.0,
        },
        {
          metric: "Sleep (Sen)",
          actual: latestDailySetting.sleep_duration || 0,
          goal: 8,
        },
      ];
    } else if (view === "week") {
      const startOfWeek = new Date();
      startOfWeek.setDate(
        startOfWeek.getDate() - (startOfWeek.getDay() || 7) + 1
      ); // Adjust to start from Monday
      const weekDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date.toISOString().split("T")[0];
      });

      goalsData = weekDays.map((date, index) => {
        const dailySetting = dailySettings.find(
          (setting) => setting.created_at.split("T")[0] === date
        ) || {
          calories_eaten: 0,
          steps_taken: 0,
          water_consumed: 0,
          sleep_duration: 0,
          created_at: "",
        };
        return {
          day: index + 1, // Correctly map the day of the week starting from Monday
          actual: this.metricActual(dailySetting, weekMetric),
          goal: this.metricGoal(personalInfoData, weekMetric),
        };
      });
    } else if (view === "month") {
      const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
      goalsData = daysInMonth.map((day) => {
        const dailySetting = dailySettings.find(
          (setting) =>
            new Date(setting.created_at).getDate() === day &&
            new Date(setting.created_at).getMonth() + 1 === currentMonth
        ) || {
          calories_eaten: 0,
          steps_taken: 0,
          water_consumed: 0,
          sleep_duration: 0,
          created_at: "",
        };
        return {
          day,
          actual: this.metricActual(dailySetting, weekMetric),
          goal: this.metricGoal(personalInfoData, weekMetric),
        };
      });
    }

    this.setState({ goalsData });
  }

  render() {
    const { view, weekMetric, language } = this.props; // Destructure language prop
    const { goalsData } = this.state;

    const actualLabel = language === "pl" ? "Rzeczywiste" : "Actual";
    const goalLabel = language === "pl" ? "Cel" : "Goal";
    const metricLabels: { [key: string]: string } = {
      steps: language === "pl" ? "Kroki" : "Steps",
      water: language === "pl" ? "Woda" : "Water",
      calories: language === "pl" ? "Kalorie" : "Calories",
      sleep: language === "pl" ? "Sen" : "Sleep",
    };

    return (
      <div className={styles.goalsChart}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={goalsData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={view === "today" ? "metric" : "day"} />
            <YAxis />
            <Tooltip />
            <Legend />
            {view === "today" ? (
              <>
                <Bar dataKey="actual" fill="#82ca9d" name={actualLabel} />
                <Bar dataKey="goal" fill="#8884d8" name={goalLabel} />
              </>
            ) : (
              <>
                <Bar
                  dataKey="actual"
                  fill="#82ca9d"
                  name={`${metricLabels[weekMetric]} ${actualLabel}`}
                />
                <Bar
                  dataKey="goal"
                  fill="#8884d8"
                  name={`${metricLabels[weekMetric]} ${goalLabel}`}
                />
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
