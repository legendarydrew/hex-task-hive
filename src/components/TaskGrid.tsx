import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { TaskDialog } from "./TaskDialog";
import RuneToken from "./RuneToken";

const TaskGrid = () => {
  const { state, toggleTaskCompletion } = useApp();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Filter tasks for the active list
  const activeTasks = state.activeListId
    ? state.tasks.filter((task) => task.listId === state.activeListId)
    : [];

  // Get active list
  const activeList = state.activeListId
    ? state.lists.find((list) => list.id === state.activeListId)
    : null;

  function taskClickHandler(e) {
    console.log('taskClickHandler', e);
  }

  // Get category color class
  const getCategoryColorClass = (category: string) => {
    const normalizedCategory = category.toLowerCase();

    switch (normalizedCategory) {
      case "work":
        return "bg-hexagon-blue";
      case "personal":
        return "bg-hexagon-purple";
      case "health":
        return "bg-hexagon-green";
      case "finance":
        return "bg-hexagon-yellow";
      case "education":
        return "bg-hexagon-orange";
      default:
        // Generate a deterministic color based on category name
        const hash = normalizedCategory
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const colors = [
          "bg-sky-600",
          "bg-emerald-600",
          "bg-amber-600",
          "bg-rose-600",
          "bg-violet-600",
          "bg-teal-600",
        ];
        return colors[hash % colors.length];
    }
  };

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

  return (
    <div className="flex-1 p-6 overflow-auto">
      {!state.activeListId ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h2 className="text-2xl font-bold text-muted-foreground mb-2">
            Welcome to Hex Task Hive
          </h2>
          <p className="text-muted-foreground max-w-md">
            Select a list from the sidebar or create a new list to get started.
          </p>
        </div>
      ) : activeTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h2 className="text-xl font-bold text-muted-foreground mb-2">
            No tasks in this list
          </h2>
          <p className="text-muted-foreground max-w-md">
            Create your first task by clicking the "New Task" button above.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h2 className="text-2xl font-bold">
              {activeList?.name || "Tasks"}
            </h2>
          </div>

          <div className="hexagon-grid">
            {activeTasks.map((task, index) => (
              <RuneToken key={task.id} taskId={index} task={task} onClick={taskClickHandler}></RuneToken>
            ))}
          </div>
        </>
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
