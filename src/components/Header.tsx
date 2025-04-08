import React from "react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { Hexagon, PlusCircle, Shuffle, StickyNote, UndoDot } from "lucide-react";
import { TaskDialog } from "./TaskDialog";
import { ListDialog } from "./ListDialog";
import { ListResetDialog } from "./ListResetDialog";
import TaskListManagement from "./TaskListManagement";

export const Header = () => {
  const { state, selectRandomTask, shuffleTasks } = useApp();
  const [isListResetDialogOpen, setIsListResetDialogOpen] = React.useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<string | null>(null);

  const handleRandomTask = () => {
    const task = selectRandomTask();
    if (task) {
      setSelectedTask(task.id);
    }
  };

  return (
    <header className="w-full bg-white shadow-sm p-3">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex sm:w-2/3 items-center justify-between">
          <h1 className="flex gap-2 items-center text-xl font-bold text-primary w-2/5">
            <Hexagon />
            Task Hive
          </h1>

          <div className="flex gap-2 justify-center sm:justify-end w-3/5">
            <TaskListManagement />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
          <Button
            variant="destructive"
            disabled={!state.activeListId}
            onClick={() => setIsListResetDialogOpen(true)}
            title="Reset Tasks"
          >
            <UndoDot className="h-4 w-4" />
          </Button>

          <Button
            variant="secondary"
            onClick={shuffleTasks}
            disabled={!state.activeListId}
            className="flex items-center gap-1"
          >
            <Shuffle className="h-4 w-4" />
            <span>Shuffle Tasks</span>
          </Button>

          <Button
            variant="default"
            onClick={handleRandomTask}
            disabled={!state.activeListId}
            className="flex items-center gap-1"
          >
            <StickyNote className="h-4 w-4" />
            <span>Random Task</span>
          </Button>
        </div>
      </div>

      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={(open) => {
          setIsTaskDialogOpen(open);
          if (!open) setSelectedTask(null);
        }}
        taskId={selectedTask}
      />

      <ListResetDialog open={isListResetDialogOpen} onOpenChange={setIsListResetDialogOpen} />
    </header>
  );
};
