
import Footer from './Footer';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import TaskGrid from './TaskGrid';

/**
 * A relatively simple layout: header, contents and footer.
 * 
 * The AI-generated version had a sidebar containing the list of TaskLists. Instead, this will become
 * a dropdown list in the header.
 */
export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
        <Sidebar />
        <TaskGrid />
      </div>
      <Footer />
    </div>
  );
};
