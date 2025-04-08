import { useState, useEffect, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { TaskDialog } from "./TaskDialog";
import RuneToken from "./RuneToken";

const TaskGrid = () => {
  const { state } = useApp();
  const [maxTokensAcross, setMaxTokensAcross] = useState<number>(1);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Filter tasks for the active list
  const activeTasks = state.activeListId
    ? state.tasks.filter((task) => task.listId === state.activeListId)
    : [];

  function taskClickHandler(e) {
    console.log("taskClickHandler", e);
  }

  const handleHighlight = (id: string | null) => {
    setHighlightedId(id);

    // Clear highlight after animation
    if (id) {
      setTimeout(() => {
        setHighlightedId(null);
      }, 2000);
    }
  };

  useEffect(() => {
    // Find the task that was selected randomly
    const randomlySelectedTask = activeTasks.find(
      (task) => task.id === highlightedId
    );
    if (randomlySelectedTask) {
      // Scroll to the task element
      const taskElement = document.getElementById(
        `task-${randomlySelectedTask.id}`
      );
      if (taskElement) {
        taskElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [highlightedId, activeTasks]);

  /**
   * To arrange the tokens as a hexagonal grid, we will need:
   * - the width of the container;
   * - the width of a token.
   */
  const tokenGrid = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      const gridWidth = node.getBoundingClientRect().width;
      const tokenWidth = node.children.item(0).getBoundingClientRect().width;
      setMaxTokensAcross(Math.floor(gridWidth / tokenWidth));
      console.log('max. number of tokens across', maxTokensAcross);
    }
  }, []);

  return (
    <div className="flex p-3 overflow-auto">
      {!state.activeListId ? (
        <div className="flex flex-col items-center justify-center w-full h-full text-center">
          <h2 className="text-2xl font-bold text-muted-foreground mb-2">
            Welcome to Task Hive!
          </h2>
          <p className="text-muted-foreground max-w-md">
            Select a list from the header, or create a new list to get started.
          </p>
        </div>
      ) : activeTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full h-full text-center">
          <h2 className="text-xl font-bold text-muted-foreground mb-2">
            No tasks in this list...
          </h2>
          <p className="text-muted-foreground max-w-md">
            Create your first task in the list to your right.
          </p>
        </div>
      ) : (
        <div ref={tokenGrid} className="flex justify-center flex-wrap h-auto">
          {activeTasks.map((task, index) => (
            <RuneToken
              key={task.id}
              taskId={index}
              task={task}
              onClick={taskClickHandler}
            ></RuneToken>
          ))}
        </div>
      )}

      <TaskDialog
        open={selectedTaskId !== null}
        onOpenChange={(open) => !open && setSelectedTaskId(null)}
        taskId={selectedTaskId}
      />
    </div>
  );
};

export default TaskGrid;
