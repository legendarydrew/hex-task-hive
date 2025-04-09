import { Header } from "./Header";
import { Footer } from "./Footer";
import TaskGrid from "./TaskGrid";
import TaskList from "./TaskList";
import TaskAdd from "./TaskAdd";
import TaskListProgressBar from "./TaskListProgressBar";
import { useApp } from "@/context/AppContext";

/**
 * A relatively simple layout: header, contents and footer.
 *
 * The AI-generated version had a sidebar containing the list of TaskLists. Instead, this will become
 * a dropdown list in the header.
 */
export const Layout = () => {
  const { state } = useApp();

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />

      <TaskListProgressBar />

      {/* TODO why is this height bigger then intended? */}
      <main className="container mx-auto mb-2 flex flex-col sm:flex-row h-full items-stretch">
        <div className="flex-grow overflow-y-auto">
          <TaskGrid />
        </div>

        {state.activeListId && (
          <aside className="bg-white sm:w-1/3 flex-shrink-0 flex flex-col">
            <div className="flex-grow overflow-y-auto h-full">
              <TaskList />
            </div>
            <TaskAdd />
          </aside>
        )}
      </main>

      <Footer />
    </div>
  );
};
