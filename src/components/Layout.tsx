import { Header } from "./Header";
import { Footer } from "./Footer";
import TaskGrid from "./TaskGrid";
import TaskList from "./TaskList";
import TaskAdd from "./TaskAdd";

/**
 * A relatively simple layout: header, contents and footer.
 *
 * The AI-generated version had a sidebar containing the list of TaskLists. Instead, this will become
 * a dropdown list in the header.
 */
export const Layout = () => {
  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />

      {/* TODO why is this height bigger then intended? */}
      <main className="flex flex-col sm:flex-row h-full items-stretch">
        <div className="flex-grow overflow-y-auto">
          <TaskGrid />
        </div>

        <aside className="sm:w-1/3 flex-shrink-0 flex flex-col">
          <div className="flex-grow overflow-y-auto">
            <TaskList />
          </div>
          <TaskAdd />
        </aside>
      </main>

      <Footer />
    </div>
  );
};
