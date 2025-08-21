import { LayoutHeader } from "./LayoutHeader";
import { LayoutFooter } from "./LayoutFooter";
import TokenGrid from "./TokenGrid";
import TaskListProgressBar from "./TaskListProgressBar";
import { useApp } from "@/context/AppContext";
import { TaskSidebar } from "./TaskSidebar";
import { useEffect } from "react";

/**
 * A relatively simple layout: header, contents and footer.
 *
 * The AI-generated version had a sidebar containing the list of TaskLists. Instead, this will become
 * a dropdown list in the header.
 */
export const Layout: React.FC<void> = () => {
  const { isListComplete, selectRandomTask, shuffleTasks, undoDeleteTask } =
    useApp();
  /**
   * Listen for keypresses while this page is open, looking specifically for an undo command.
   * https://stackoverflow.com/a/61740188/4073160
   * https://github.com/facebook/react/issues/14699#issuecomment-457653146
   * The last link addressed a major issue with using old state values, as well as running more than once.
   */
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.altKey && e.key.toLowerCase() === "u") {
      undoDeleteTask(); // Undo (Alt + U)
    } else if (e.ctrlKey && e.key.toLowerCase() === "enter") {
      selectRandomTask(); // Random Task (Ctrl + Enter)
    } else if (e.ctrlKey && e.key.toLowerCase() === "#") {
      shuffleTasks(); // Shuffle Tasks (Ctrl + #')
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    console.log("complete?", isListComplete);
  }, [isListComplete]);

  return (
    <div className="h-screen flex flex-col bg-background">
      <LayoutHeader />

      <TaskListProgressBar />

      <main className="container mx-auto flex flex-col sm:flex-row h-full items-stretch overflow-hidden">
        <div className="flex-grow overflow-y-auto min-h-full">
          <TokenGrid />
        </div>

        <TaskSidebar />
      </main>

      <LayoutFooter />
    </div>
  );
};
