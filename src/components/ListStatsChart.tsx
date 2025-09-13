import { useApp } from "@/context/AppContext";
import { TaskList } from "@/types";
import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface Props {
    taskList: TaskList;
}

export const ListStatsChart: React.FC<Props> = ({ taskList }) => {
  const { state } = useApp();
  const [chartData, setChartData] = useState<
    { date: number; picked: number; completed: number }[]
  >([]);
  const [chartLimits, setChartLimits] = useState(null);
  const [chartPickedLineColour, setChartPickedLineColour] = useState("blue");
  const [chartCompletedLineColour, setChartCompletedLineColour] =
    useState("green");

  useEffect(() => {
    let styles = getComputedStyle(document.documentElement);
    setChartPickedLineColour(styles.getPropertyValue("--color-task-picked"));
    setChartCompletedLineColour(
      styles.getPropertyValue("--color-task-complete-border")
    );
  }, []);

    const dateValue = (timestamp?: string): number => {
      return new Date(timestamp?.slice(0, 10)).valueOf();
    };
  
  
  const buildChartData = () => {
        if (taskList) {
      // Build chart data from the list of tasks.
      const picked: {[key: string]: number} = {};
      const completed: {[key: string]: number} = {}
      const activeListTasks = state.tasks.filter((task) => task.listId === taskList.id);

      // Number of tasks picked.
      activeListTasks
        .filter((task) => task.pickedAt)
        .sort((a, b) => (a.pickedAt > b.pickedAt ? 1 : -1))
        .forEach((task) => {
          const taskDate = dateValue(task.pickedAt);
          picked[taskDate] = picked[taskDate] ? picked[taskDate] + 1 : 1;
        });

      // Number of tasks completed.
      activeListTasks
        .filter((task) => task.completedAt)
        .sort((a, b) => (a.completedAt > b.completedAt ? 1 : -1))
      .forEach((task) => {
        const taskDate = dateValue(task.completedAt);
        completed[taskDate] = completed[taskDate] ? completed[taskDate] + 1 : 1;
      });

      const dates = [...new Set([...Object.keys(picked), ...Object.keys(completed)])].sort();
      const chartData: {date: number, picked: number, completed: number}[] = dates.map((date) => ({
        date: parseInt(date),
        picked: picked[date] ?? 0,
        completed: completed[date] ?? 0
      }));

      // In order to display a line on the chart: if we only have results for one day,
      // add yesterday with a count of 0.
      if (chartData.length === 1) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        chartData.unshift({ date: dateValue(yesterday.toString()), picked: 0, completed: 0 });
      }

      setChartData(chartData);
      setChartLimits({
        min: dateValue(taskList.createdAt),
        max: dateValue(),
      });
    } else {
      setChartData([]);
    }
  };

  useEffect(buildChartData, [taskList]);

  return (
    <div className="h-[20vh]">
      <ResponsiveContainer
        className="bg-white mx-auto border-gray-500 border-l-[1px] border-b-[1px]"
        width="100%"
        height="100%"
      >
        <LineChart
          data={chartData}
          margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
        >
          {chartLimits && (
            <XAxis
              hide={true}
              dataKey="date"
              interval={"preserveStartEnd"}
              scale="utc"
              type="number"
              domain={[chartLimits.min, chartLimits.max]}
            />
          )}
          <YAxis hide={true} tick={false}></YAxis>
          <Line dataKey="picked" stroke={chartPickedLineColour} dot={false} />
          <Line
            dataKey="completed"
            stroke={chartCompletedLineColour}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
