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
  const { undoDeleteTask } = useApp();
  /**
   * Listen for keypresses while this page is open, looking specifically for an undo command.
   * https://stackoverflow.com/a/61740188/4073160
   */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.altKey && e.key.toLowerCase() === "u") {
        undoDeleteTask();  // Alt + U
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background">
      <LayoutHeader />

      <TaskListProgressBar />

      {/* TODO why is this height bigger then intended? */}
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
