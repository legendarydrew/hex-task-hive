import React from "react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { Hexagon, PlusCircle, Shuffle, StickyNote } from "lucide-react";
import { TaskDialog } from "./TaskDialog";
import { ListDialog } from "./ListDialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export const Header = () => {
  const { state, setActiveList, selectRandomTask, shuffleTasks } = useApp();
  const [isListDialogOpen, setIsListDialogOpen] = React.useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<string | null>(null);

  const taskLists = state.lists;

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
            {/* Select a task list. */}
            <Select value={state.activeListId} onValueChange={setActiveList}>
              <SelectTrigger
                className="font-bold h-10 text-sm"
                id="tasklist"
              >
                <SelectValue placeholder="Task lists" />
              </SelectTrigger>
              <SelectContent>
                {taskLists.map((list) => (
                  <SelectItem key={list.id} value={list.id}>
                    {list.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setIsListDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              <span>New List</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
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

      <ListDialog open={isListDialogOpen} onOpenChange={setIsListDialogOpen} />
    </header>
  );
};
