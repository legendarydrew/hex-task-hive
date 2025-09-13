import React, {useState} from "react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { Hexagon, ListCheckIcon, Shuffle, StickyNote, UndoDot } from "lucide-react";
import { ListResetDialog } from "./ListResetDialog";
import TaskListManagement from "./TaskListManagement";
import { Tooltip, TooltipContent } from "./ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { ListStatsDialog } from "./ListStatsDialog";

export const LayoutHeader: React.FC = () => {
  const { state, selectRandomTask, shuffleTasks } = useApp();
  const [isListResetDialogOpen, setIsListResetDialogOpen] = useState(false);
  const [isListStatsDialogOpen, setIsListStatsDialogOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm p-3">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex sm:w-2/3 items-center justify-between">
          <h1 className="heading-text flex gap-2 items-center text-xl text-primary w-1/4 select-none">
            <Hexagon />
            Task Hive
          </h1>

          <div className="flex gap-2 justify-center sm:justify-end w-3/5">
            <TaskListManagement />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
          <Tooltip>
            <TooltipTrigger asChild onClick={() => setIsListStatsDialogOpen(true)}>
              <Button
                variant="secondary"
                disabled={!state.activeListId}
                className="flex items-center gap-1"
              >
                <ListCheckIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={1}>Task List Statistics</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild onClick={() => setIsListResetDialogOpen(true)}>
              <Button
                variant="destructive"
                disabled={!state.activeListId}
              >
                <UndoDot className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={1}>Reset Task List</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild onClick={shuffleTasks}>
              <Button
                variant="secondary"
                disabled={!state.activeListId}
                className="flex items-center gap-1"
              >
                <Shuffle className="h-4 w-4" />
                <span>Shuffle Tasks</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={1}>Ctrl + #</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild onClick={selectRandomTask}>
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

      <ListStatsDialog
        listId={state.activeListId}
        open={isListStatsDialogOpen}
        onOpenChange={setIsListStatsDialogOpen}
      />

    </header>
  );
};
