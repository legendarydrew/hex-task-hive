import { useApp } from "@/context/AppContext";
import { Task } from "@/types";
import { Check, Undo, Trash, Edit } from "lucide-react";
import "./TaskList.scss";
import TaskListUpdate from "./TaskListUpdate";
import { useState } from "react";
/**
 * A component simply displaying the list of tasks in the currently selected list.
 * From here we should be able to update or remove the tasks.
 */

export default function TaskList(props) {
  const { state, deleteTask, toggleTaskCompletion } = useApp();

  const [taskForEdit, setTaskForEdit] = useState<Task>();

  const activeTasks: Task[] = state.activeListId
    ? state.tasks.filter((task) => task.listId === state.activeListId)
    : [];

  const beginTaskUpdateHandler = (task: Task) => {
    setTaskForEdit(task);
  };

  const closeUpdateHandler = (): void => {
    setTaskForEdit(undefined);
  };

  const removeTaskHandler = (task: Task) => {
    // Purely for convenience, we won't bother confirming the removal of the task.
    deleteTask(task.id);
  };

  const toggleCompleteHandler = (task: Task) => {
    toggleTaskCompletion(task.id);
  };

  const taskClass = (task: Task) => {
    if (task.completedAt) {
      return "text-task-completed";
    } else if (task.pickedAt) {
      return "text-task-picked-border";
    }
  };

  return (
    <ol className="bg-white w-full p-1 text-sm">
      {activeTasks.map((task: Task, index) => (
        <li
          className={
            "flex gap-2 p-1 items-center hover:bg-blue-200 select-none " +
            taskClass(task)
          }
          key={index}
        >
          {taskForEdit === task ? (
            <TaskListUpdate task={task} onClose={closeUpdateHandler} />
          ) : (
            <>
              <b className="text-right w-6">{index}</b>
              <span className="flex-grow">{task.description}</span>
              <menu className="flex gap-1 justify-end">
                {/* TODO see https://v1.tailwindcss.com/components/buttons for implementing button styles. */}
                <button
                  type="button"
                  onClick={() => beginTaskUpdateHandler(task)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-6 lh-1 py-1 px-2 rounded"
                  title="Change description"
                >
                  <Edit className="h-3 w-3" />
                </button>
                {task.completedAt ? (
                  <button
                    type="button"
                    onClick={() => toggleCompleteHandler(task)}
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold h-6 lh-1 py-1 px-2 rounded"
                    title="Unmark as complete"
                  >
                    <Undo className="h-3 w-3" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleCompleteHandler(task)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold h-6 lh-1 py-1 px-2 rounded"
                    title="Mark as complete"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeTaskHandler(task)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold lh-1 py-1 px-2 rounded"
                  title="Remove"
                >
                  <Trash className="h-3 w-3" />
                </button>
              </menu>
            </>
          )}
        </li>
      ))}
    </ol>
  );
}
