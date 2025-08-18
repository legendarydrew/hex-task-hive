import { LayoutHeader } from "./LayoutHeader";
import { LayoutFooter } from "./LayoutFooter";
import TaskGrid from "./TaskGrid";
import TaskList from "./TaskList";
import TaskAddForm from "./TaskAddForm";
import TaskListProgressBar from "./TaskListProgressBar";
import { useApp } from "@/context/AppContext";
import TaskBulkAdd from "./TaskBulkAddForm";

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
          <TaskGrid />
        </div>

        {state.activeListId && (
          <aside className="bg-white sm:w-1/3 flex-shrink-0 flex flex-col">
            <div className="flex-grow overflow-y-auto h-full">
              <TaskList />
            </div>
            <TaskAddForm />
            <TaskBulkAdd />
          </aside>
        )}
      </main>

      <LayoutFooter />
    </div>
  );
};
