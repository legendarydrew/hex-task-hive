import {
  useState,
  useEffect,
  createRef,
} from "react";
import { useApp } from "@/context/AppContext";
import { TaskDialog } from "./TaskDialog";
import RuneToken from "./RuneToken";

const TaskGrid = () => {
  const { state } = useApp();
  const [maxTokensAcross, setMaxTokensAcross] = useState<number>(1);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [gridBreakpoints, setGridBreakpoints] = useState<number[]>([]);
  const [gridIsEvenWidth, setGridIsEvenWidth] = useState<boolean>(false);

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
   * This should work because the grid is only visible when there's at least one task.
   * http://stackoverflow.com/questions/58222004/ddg#58222325
   */
  const tokenGrid = createRef();

  // This effect is called when we have a reference to the token grid element.
  useEffect(() => {
      if (tokenGrid.current !== null) {
        // Observe resize changes to the token grid container. (What a headache to find an answer for.)
        // https://www.reddit.com/r/reactjs/comments/lz3o9t/comment/gqgf486/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
        // https://developer.mozilla.org/en-US/docs/Web/API/Resize_Observer_API
        const node: HTMLDivElement = (tokenGrid.current as HTMLDivElement);
        const observer = new ResizeObserver(() => {
          const gridWidth = node.getBoundingClientRect().width;
          const tokenWidth = node.children
            .item(0)
            .getBoundingClientRect().width;
          const tokensAcross = Math.floor(gridWidth / tokenWidth);
          setMaxTokensAcross(tokensAcross);
          setGridIsEvenWidth(tokensAcross % 2 === 0);
        });
        observer.observe(node);
        return () => {
          observer.disconnect();
        };
      }
    },
    [tokenGrid]
  );

  // This effect is called when the maximum number of tokens across changes.
  useEffect(() => {
    const breakpoints = [];
    const increment = maxTokensAcross * 2 - 1;
    for (let i = -1; i < activeTasks.length; i += increment) {
      if (i >= 0) {
        breakpoints.push(i);
      }
    }
    // "Stray" tokens at the end of the list are handled in the stylesheet.

    setGridBreakpoints(breakpoints);
  }, [maxTokensAcross]);

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
        <div
          ref={tokenGrid}
          className={"flex justify-center flex-wrap w-full h-auto " + (gridIsEvenWidth ? 'even-width' : 'odd-width')}
        >
          {activeTasks.map((task, index: number) => (
            <>
              <RuneToken
                taskId={index}
                task={task}
                onClick={taskClickHandler}
              ></RuneToken>
              {gridBreakpoints.includes(index) ? (
                <span className="block w-full h-0" />
              ) : null}
            </>
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
