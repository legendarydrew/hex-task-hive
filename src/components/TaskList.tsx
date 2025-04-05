import { useApp } from "@/context/AppContext";
import { Task } from "@/types";
import "./TaskList.scss";

/**
 * A component simply displaying the list of tasks in the currently selected list.
 * From here we should be able to update or remove the tasks.
 */

export default function TaskList() {
  const { state, toggleTaskCompletion } = useApp();

  const activeTasks: Task[] = state.activeListId
    ? state.tasks.filter((task) => task.listId === state.activeListId)
    : [];

  return (
    // Using a table for now, but we might want to use a two-column flex-layout.
    <ol className="task-list">
      {activeTasks.map((task, index) => (
        <li className="task-list-item" key={index}>
          <b className="task-list-item-number">{index}</b>
          <span className="task-list-item-text">{task.description}</span>
          <menu className="task-list-item-actions">
            <button type="button" title="Change description">Edit</button>
            <button type="button" title="Mark as complete">Completed</button>
            <button type="button" title="Remove">Remove</button>
          </menu>
        </li>
      ))}
    </ol>
  );
}
