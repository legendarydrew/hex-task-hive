import { LayoutHeader } from "./LayoutHeader";
import { LayoutFooter } from "./LayoutFooter";
import TokenGrid from "./TokenGrid";
import TaskList from "./TaskList";
import TaskAddForm from "./TaskAddForm";
import TaskListProgressBar from "./TaskListProgressBar";
import { useApp } from "@/context/AppContext";
import TaskBulkAdd from "./TaskBulkAddForm";
import TaskFormToggle from "./TaskFormToggle";
import { TaskSidebar } from "./TaskSidebar";

/**
 * A relatively simple layout: header, contents and footer.
 *
 * The AI-generated version had a sidebar containing the list of TaskLists. Instead, this will become
 * a dropdown list in the header.
 */
export const Layout: React.FC<void> = () => {
  const { state } = useApp();

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
