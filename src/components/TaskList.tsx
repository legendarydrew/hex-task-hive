import { useApp } from "@/context/AppContext";
import { Task } from "@/types";
import TaskListUpdateForm from "./TaskListUpdateForm";
import { useState } from "react";
import { TaskListItem } from "./TaskListItem";
/**
 * A component simply displaying the list of tasks in the currently selected list.
 * From here we should be able to update or remove the tasks.
 */

export default function TaskList(props) {
  const { state } = useApp();

  const [taskForEdit, setTaskForEdit] = useState<Task>();

  const activeTasks: Task[] = state.activeListId
    ? state.tasks.filter((task) => task.listId === state.activeListId)
    : [];

  const editHandler = (task: Task): void => {
    setTaskForEdit(task);
  };

  const closeUpdateHandler = (): void => {
    setTaskForEdit(undefined);
  };

  const taskClass = (task: Task) => {
    if (task.completedAt) {
      return "bg-task-completed bg-opacity-25 hover:bg-opacity-50";
    } else if (task.pickedAt) {
      return "bg-task-picked hover:bg-opacity-50";
    } else {
      return "hover:bg-task-base hover:bg-opacity-50";
    }
  };

  return (
    <ol className="w-full p-1 text-sm">
      {activeTasks.map((task: Task, index) => (
        <li
          className={
            "flex gap-2 p-1 items-center select-none bg-opacity-25 " +
            taskClass(task)
          }
          key={index}
        >
          {taskForEdit === task ? (
            <TaskListUpdateForm task={task} onClose={closeUpdateHandler} />
          ) : (
            <TaskListItem task={task} taskNumber={index} onEdit={editHandler} />
          )}
        </li>
      ))}
    </ol>
  );
}
