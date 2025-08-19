import { useApp } from "@/context/AppContext";
import { Task } from "@/types";
import { Check, Edit, Trash, Undo } from "lucide-react";
import { Button } from "./ui/button";

interface TaskListItemProps {
  taskNumber: number;
  task: Task;
  onEdit: (task: Task) => void;
}

export const TaskListItem: React.FC<TaskListItemProps> = ({
  taskNumber,
  task,
  onEdit,
}) => {
  const { deleteTask, toggleTaskCompletion } = useApp();

  const beginTaskUpdateHandler = (task: Task) => {
    onEdit(task);
  };

  const removeTaskHandler = (task: Task) => {
    // Purely for convenience, we won't bother confirming the removal of the task.
    deleteTask(task.id);
  };

  const toggleCompleteHandler = (task: Task) => {
    toggleTaskCompletion(task.id);
  };

  return (
    <>
      <span className="heading-text text-right w-8">{taskNumber}</span>
      <span className="flex-grow">{task.description}</span>
      <menu className="flex gap-0.5 justify-end">
        <Button
          type="button"
          className="rounded-none"
          variant="secondary"
          size="icon"
          onClick={() => beginTaskUpdateHandler(task)}
          title="Change description"
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          className="rounded-none"
          variant={task.completedAt ? "outline" : "confirm"}
          size="icon"
          onClick={() => toggleCompleteHandler(task)}
          title={task.completedAt ? "Unmark as complete" : "Mark as complete"}
        >
          {task.completedAt ? (
            <Undo className="h-3 w-3" />
          ) : (
            <Check className="h-3 w-3" />
          )}
        </Button>
        <Button
          type="button"
          className="rounded-r rounded-l-none"
          variant="destructive"
          size="icon"
          onClick={() => removeTaskHandler(task)}
          title="Remove"
        >
          <Trash className="h-3 w-3" />
        </Button>
      </menu>
    </>
  );
};
