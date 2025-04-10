import { useApp } from "@/context/AppContext";
import { Task } from "@/types";
import { Check, Undo, Trash, Edit } from "lucide-react";
import TaskListUpdateForm from "./TaskListUpdateForm";
import { useState } from "react";
import { Button } from "./ui/button";
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
      return "bg-task-completed bg-opacity-25 hover:bg-opacity-50";
    } else if (task.pickedAt) {
      return "bg-task-picked hover:bg-opacity-50";
    } else {
      return "hover:bg-task-base hover:bg-opacity-50"
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
            <>
              <b className="text-right w-6">{index}</b>
              <span className="flex-grow">{task.description}</span>
              <menu className="flex gap-1 justify-end">
                {/* TODO see https://v1.tailwindcss.com/components/buttons for implementing button styles. */}
                <Button
                  type="button"
                  variant="default"
                  size="icon"
                  onClick={() => beginTaskUpdateHandler(task)}
                  title="Change description"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                {task.completedAt ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => toggleCompleteHandler(task)}
                    title="Unmark as complete"
                  >
                    <Undo className="h-3 w-3" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="confirm"
                    size="icon"
                    onClick={() => toggleCompleteHandler(task)}
                    title="Mark as complete"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeTaskHandler(task)}
                  title="Remove"
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </menu>
            </>
          )}
        </li>
      ))}
    </ol>
  );
}
