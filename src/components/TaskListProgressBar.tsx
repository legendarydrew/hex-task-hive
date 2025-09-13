import { useApp } from "@/context/AppContext";
import { Task } from "@/types";
import { Progress } from "./ui/progress";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

/**
 * A simple component for displaying a task completion progress bar.
 */

export default function TaskListProgressBar() {
  const { state } = useApp();

  const activeTasks: Task[] = state.activeListId
    ? state.tasks.filter((task) => task.listId === state.activeListId)
    : [];

  const [completion, setCompletion] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  useEffect(() => {
    const completed = activeTasks.filter((task) => task.completedAt).length;
    setCompletedTasks(completed);
    setCompletion((completed / activeTasks.length) * 100);
  }, [activeTasks]);

  return activeTasks.length ? (
    <div className="group relative overflow-hidden transition-(height) h-2 hover:h-6 flex-shrink-0">
      <Progress className="h-full" value={completion} max={100} />
      <span className="hidden group-hover:block absolute top-1/2 right-2 -translate-y-1/2 font-semibold text-white text-shadow-md text-shadow-slate-600 text-sm select-none">
        {completedTasks.toLocaleString()} /{" "}
        {activeTasks.length.toLocaleString()} completed.
      </span>
    </div>
  ) : null;
}
