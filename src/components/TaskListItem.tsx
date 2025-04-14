import { useApp } from "@/context/AppContext";
import { Task } from "@/types";
import { Check, Undo, Trash, Edit } from "lucide-react";
import { Button } from "./ui/button";

interface TaskListItemProps {
  taskNumber: number;
  task: Task;
  onEdit: (task: Task) => void
}

export const TaskListItem: React.FC<TaskListItemProps> = ({
  taskNumber,
  task,
  onEdit
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
      <span className="font-bold text-right w-6">{taskNumber}</span>
      <span className="flex-grow">{task.description}</span>
      <menu className="flex gap-1 justify-end">
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
  );
};
