import { useApp } from "@/context/AppContext";
import { Task } from "@/types";
import { Check, Edit, Icon, Trash, Undo } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

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
  const { deleteTask, toggleTaskCompletion, toggleTaskPicked } = useApp();

  const beginTaskUpdateHandler = (): void => {
    onEdit(task);
  };

  const removeTaskHandler = (): void => {
    // Purely for convenience, we won't bother confirming the removal of the task.
    // However, we want the ability to undo the most recent deletion, in case it was by accident.
    deleteTask(task.id);
  };

  const toggleCompleteHandler = (): void => {
    toggleTaskCompletion(task.id);
  };

  const togglePickedHandler = (): void => {
    if (!task.completedAt) {
      toggleTaskPicked(task.id);
      toast.info({ title: task.pickedAt ? 'Unpicked' :'Picked', description: task.description });
    }
  };

  return (
    <>
      <span
        className={cn(
          "heading-text text-right w-6 flex-shrink-0",
          !task.completedAt && "cursor-pointer"
        )}
        onClick={togglePickedHandler}
      >
        {taskNumber + 1}
      </span>
      <span
        className={cn("flex-grow", !task.completedAt && "cursor-pointer")}
        onClick={togglePickedHandler}
      >
        {task.description}
      </span>
      <menu className="flex gap-0.5 justify-end">
        <Button
          type="button"
          className="rounded-none"
          variant="secondary"
          size="icon"
          onClick={beginTaskUpdateHandler}
          title="Change description"
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          className="rounded-none"
          variant={task.completedAt ? "outline" : "confirm"}
          size="icon"
          onClick={toggleCompleteHandler}
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
          onClick={removeTaskHandler}
          title="Remove"
        >
          <Trash className="h-3 w-3" />
        </Button>
      </menu>
    </>
  );
};
