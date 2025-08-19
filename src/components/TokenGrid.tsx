import {
  useState,
  useEffect,
  createRef,
  Fragment,
  RefObject,
  useRef,
} from "react";
import { useApp } from "@/context/AppContext";
import { RuneToken } from "./RuneToken";
import TokenGridNoTasks from "./TokenGridNoTasks";
import TokenGridNoList from "./TokenGridNoList";
import { calculateHexPositions, cn } from "@/lib/utils";

const TokenGrid = () => {
  const { state } = useApp();
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [gridWidth, setGridWidth] = useState<number>(0);
  const [tokenRadius, setTokenRadius] = useState<number>(0);
  const [tokenPositions, setTokenPositions] = useState([]);

  // Filter tasks for the active list
  const activeTasks = state.activeListId
    ? state.tasks.filter((task) => task.listId === state.activeListId)
    : [];

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
  const tokenGrid: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();

  // This effect is called when we have a reference to the token grid element.
  useEffect(() => {
    if (tokenGrid.current) {
      // Observe resize changes to the token grid container. (What a headache to find an answer for.)
      // https://www.reddit.com/r/reactjs/comments/lz3o9t/comment/gqgf486/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
      // https://developer.mozilla.org/en-US/docs/Web/API/Resize_Observer_API
      const node: HTMLDivElement = tokenGrid.current as HTMLDivElement;
      const observer = new ResizeObserver(() => {
        setGridWidth(node.getBoundingClientRect().width);
        setTokenRadius(
          (node.children.item(0)?.getBoundingClientRect().height ?? 0) / 2
        );
      });
      observer.observe(node);
      return () => {
        observer.disconnect();
      };
    }
  }, [tokenGrid]);

  // This effect is called when the maximum number of tokens across changes.
  useEffect(() => {
    setTokenPositions(
      calculateHexPositions(activeTasks, gridWidth, tokenRadius)
    );
  }, [gridWidth, tokenRadius, activeTasks.length]);

  return (
    <div className="token-grid">
      {!state.activeListId ? (
        <TokenGridNoList />
      ) : activeTasks.length === 0 ? (
        <TokenGridNoTasks />
      ) : (
        <div ref={tokenGrid} className="relative h-full w-full">
          {tokenPositions.map(({ x, y }, index: number) => (
            <RuneToken
              key={activeTasks[index].id}
              taskNumber={index}
              task={activeTasks[index]}
              className="absolute origin-center"
              x={x}
              y={y}
            ></RuneToken>
          ))}
        </div>
      )}
    </div>
  );
};

export default TokenGrid;
