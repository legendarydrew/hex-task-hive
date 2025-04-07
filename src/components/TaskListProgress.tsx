import { useApp } from "@/context/AppContext";
import { Task } from "@/types";
import { Progress } from "./ui/progress";
import { useEffect, useState } from "react";

/**
 * A simple component for displaying a task completion progress bar.
 */

export default function TaskListProgress() {
  const { state } = useApp();

  const activeTasks: Task[] = state.activeListId
    ? state.tasks.filter((task) => task.listId === state.activeListId)
    : [];

  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const completedTasks = activeTasks.filter((task) => task.completedAt);
    setCompletion((completedTasks.length / activeTasks.length) * 100);
  }, [activeTasks]);

  return (
    activeTasks.length ? <Progress className="h-2 flex-shrink-0" value={completion} max={100} /> : null
  );
}
