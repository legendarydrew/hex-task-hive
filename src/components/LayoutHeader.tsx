import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { Hexagon, Shuffle, StickyNote, UndoDot } from "lucide-react";
import { ListResetDialog } from "./ListResetDialog";
import TaskListManagement from "./TaskListManagement";
import React from "react";
import { Tooltip, TooltipContent } from "./ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

export const LayoutHeader: React.FC = () => {
  const { state, selectRandomTask, shuffleTasks } = useApp();
  const [isListResetDialogOpen, setIsListResetDialogOpen] =
    React.useState(false);
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
          <h1 className="heading-text flex gap-2 items-center text-xl text-primary w-2/5 select-none">
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
            onClick={() => setIsListResetDialogOpen(true)}
            disabled={!state.activeListId}
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

          <Tooltip>
            <TooltipTrigger asChild onClick={handleRandomTask}>
              <Button
                variant="default"
                disabled={!state.activeListId}
                className="flex items-center gap-1"
              >
                <StickyNote className="h-4 w-4" />
                <span>Random Task</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={1}>Ctrl + Enter</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <ListResetDialog
        open={isListResetDialogOpen}
        onOpenChange={setIsListResetDialogOpen}
      />
    </header>
  );
};
