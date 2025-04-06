import { useApp } from "@/context/AppContext";
import { Task } from "@/types";
import { Check, Trash, Edit } from "lucide-react";
import "./TaskList.scss";
/**
 * A component simply displaying the list of tasks in the currently selected list.
 * From here we should be able to update or remove the tasks.
 */

export default function TaskList(props) {
  const { state, deleteTask, toggleTaskCompletion } = useApp();

  const activeTasks: Task[] = state.activeListId
    ? state.tasks.filter((task) => task.listId === state.activeListId)
    : [];

  const beginTaskUpdateHandler = (task: Task) => {
    console.log("beginTaskUpdateHandler", task);
  };

  const removeTaskHandler = (task: Task) => {
    // Purely for convenience, we won't bother confirming the removal of the task.
    deleteTask(task.id);
  };

  const toggleCompleteHandler = (task: Task) => {
    console.log("toggleCompleteHandler", task);
    props.removeHandler && props.removeHandler(task);
  };

  return (
    <ol className="task-list">
      {activeTasks.map((task: Task, index) => (
        <li className="task-list-item" key={index}>
          <b className="task-list-item-number">{index}</b>
          <span className="task-list-item-text">{task.description}</span>
          <menu className="task-list-item-actions">
            {/* TODO see https://v1.tailwindcss.com/components/buttons for implementing button styles. */}
            <button
              type="button"
              onClick={() => beginTaskUpdateHandler(task)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold lh-1 py-1 px-2 rounded"
              title="Change description"
            >
              {/* TODO ability to change the task description. */}
              <Edit className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => toggleCompleteHandler(task)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold lh-1 py-1 px-2 rounded"
              title="Mark as complete"
            >
              {/* TODO complete/incomplete state based on the task. */}
              <Check className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => removeTaskHandler(task)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold lh-1 py-1 px-2 rounded"
              title="Remove"
            >
              <Trash className="h-3 w-3" />
            </button>
          </menu>
        </li>
      ))}
    </ol>
  );
}
