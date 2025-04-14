import { useState, useEffect, createRef, Fragment } from "react";
import { useApp } from "@/context/AppContext";
import { RuneToken } from "./RuneToken";

const TaskGrid = () => {
  const { state } = useApp();
  const [maxTokensAcross, setMaxTokensAcross] = useState<number>(1);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [gridBreakpoints, setGridBreakpoints] = useState<number[]>([]);
  const [gridOffsetLastRow, setGridOffsetLastRow] = useState<boolean>(false);

  // Filter tasks for the active list
  const activeTasks = state.activeListId
    ? state.tasks.filter((task) => task.listId === state.activeListId)
    : [];

  const isOdd = (value: number): boolean => {
    return value % 2 === 1;
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
      const node: HTMLDivElement = tokenGrid.current as HTMLDivElement;
      const observer = new ResizeObserver(() => {
        const gridWidth = node.getBoundingClientRect().width;
        const tokenWidth = node.children.item(0).getBoundingClientRect().width;
        const tokensAcross = Math.floor(gridWidth / tokenWidth);
        setMaxTokensAcross(tokensAcross);
      });
      observer.observe(node);
      return () => {
        observer.disconnect();
      };
    }
  }, [tokenGrid]);

  // This effect is called when the maximum number of tokens across changes.
  useEffect(() => {
    const breakpoints = [];
    const increment = maxTokensAcross * 2 - 1;
    for (let i = -1; i < activeTasks.length; i += increment) {
      if (i >= 0) {
        breakpoints.push(i);
      }
    }
    // Handle "stray" tokens at the end of the list.
    const tokenGroupSize = maxTokensAcross * 2 - 1;
    if (activeTasks.length > tokenGroupSize) {
      // We want to "offset" the last row of tokens to visually align them with the previous row.
      let remainderTokens = (activeTasks.length % tokenGroupSize);
      if (remainderTokens > maxTokensAcross) {
        setGridOffsetLastRow(isOdd(maxTokensAcross) === isOdd(remainderTokens));
      } else {
        setGridOffsetLastRow(isOdd(maxTokensAcross) !== isOdd(remainderTokens));
      }
    } else {
      setGridOffsetLastRow(false);
    }

    setGridBreakpoints(breakpoints);
  }, [maxTokensAcross, activeTasks.length]);

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
          className={`flex justify-center flex-wrap w-full h-auto${
            gridOffsetLastRow && " offset-last-row"
          }`}
        >
          {activeTasks.map((task, index: number) => (
            <Fragment key={index}>  
              <RuneToken taskNumber={index} task={task}></RuneToken>
              {gridBreakpoints.includes(index) ? (
                <span className="block w-full h-0" />
              ) : null}
            </Fragment>
            // <Fragment />, <React.Fragment /> and <> are the equivalent of Angular's <ng-template>.
            // We have to use <Fragment /> here so we can use the key property.
            // https://www.designcise.com/web/tutorial/how-to-add-a-key-to-an-empty-tag-in-react
          ))}
        </div>
      )}

    </div>
  );
};

export default TaskGrid;
