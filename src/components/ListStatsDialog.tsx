import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApp } from "@/context/AppContext";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

/**
 * This component is for a dialog that displays a list of Tasks in a list, with their picked and completed dates.
 */
interface ListStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listId?: string | null;
}

export const ListStatsDialog: React.FC<ListStatsDialogProps> = ({
  open,
  onOpenChange,
  listId,
}) => {
  const { state } = useApp();
  const [chartData, setChartData] = useState([]);
  const [chartLimits, setChartLimits] = useState(null);

  const activeList = state.lists.find((list) => list.id === listId);
  const activeListTasks = state.tasks.filter((task) => task.listId === listId);

  const formatDate = (timestamp: string): string => {
    return new Date(timestamp).toLocaleDateString("en-GB");
  };

  const dateValue = (timestamp?: string) => {
    return new Date(timestamp?.slice(0, 10)).valueOf();
  };

  useEffect(() => {
    // Build chart data from the list of tasks.
    const chartData = [];
    const completedTasks = activeListTasks
      .filter((task) => task.completedAt)
      .sort((a, b) => (a.completedAt > b.completedAt ? 1 : -1));
    completedTasks.forEach((task) => {
      const taskDate = dateValue(task.completedAt);
      chartData[taskDate] = chartData[taskDate] ? chartData[taskDate] + 1 : 1;
    });
    Object.keys(chartData).forEach((date) => {
      chartData.push({ date, count: chartData[date] });
    });
    setChartData(chartData);
    setChartLimits({
      min: dateValue(activeList.createdAt),
      max: dateValue(),
    });
  }, [activeList]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Statistics for {activeList?.name}</DialogTitle>
        </DialogHeader>

        <div className="h-[15vh]">
          <ResponsiveContainer
            className="bg-white mx-auto border-gray-500 border-l-[1px] border-b-[1px]"
            width={300}
            height="100%"
          >
            <LineChart
              data={chartData}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              {chartLimits && (
                <XAxis
                  hide={true}
                  dataKey="date"
                  interval={"preserveStartEnd"}
                  tick={false}
                  scale="utc"
                  type="number"
                  domain={[chartLimits.min, chartLimits.max]}
                />
              )}
              <YAxis hide={true} tick={false}></YAxis>
              <Line dataKey="count" stroke="green" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="max-h-[45vh] overflow-y-auto">
          <table className="table w-full">
            <thead>
              <tr className="text-xs sticky top-0 bg-background border-b-2">
                <th className="text-right px-1 w-4" scope="col">
                  #
                </th>
                <th className="text-left px-1" scope="col">
                  Task
                </th>
                <th className="w-[10em]" scope="col">
                  picked on
                </th>
                <th className="w-[10em]" scope="col">
                  completed at
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {activeListTasks.map((task, index) => (
                <tr className="hover:bg-gray-200" key={index}>
                  <th className="text-right font-bold px-1 w-4" scope="row">
                    {index}
                  </th>
                  <th className="text-left font-bold px-1" scope="row">
                    {task.description}
                  </th>
                  <td className="text-center">
                    {task.pickedAt ? formatDate(task.pickedAt) : "-"}
                  </td>
                  <td className="text-center">
                    {task.completedAt ? formatDate(task.completedAt) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};
