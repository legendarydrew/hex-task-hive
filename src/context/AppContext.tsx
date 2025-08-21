import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AppState, Task, TaskList } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "../components/ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { Button } from "@/components/ui/button";

interface AppContextType {
  state: AppState;
  addList: (name: string) => void;
  updateList: (
    id: string,
    data: Partial<Omit<TaskList, "id" | "createdAt">>
  ) => void;
  deleteList: (id: string) => void;
  setActiveList: (id: string) => void;
  addTask: (description: string, dueDate?: string) => void;
  updateTask: (
    id: string,
    data: Partial<Omit<Task, "id" | "listId" | "createdAt">>
  ) => void;
  deleteTask: (id: string) => void;
  undoDeleteTask: () => void;
  shuffleTasks: () => void;
  resetTasks: (listId: string) => void;
  toggleTaskCompletion: (id: string) => void;
  selectRandomTask: () => Task | null;
  toggleSidebar: () => void;
}

// Default categories to use when creating a new list
const DEFAULT_CATEGORIES = [
  "work",
  "personal",
  "health",
  "finance",
  "education",
  "other",
];

const initialState: AppState = {
  lists: [],
  tasks: [],
  deletedTasks: [],
  activeListId: null,
  sidebarIsOpen: true,
};

const LOCAL_STORAGE_KEY = "hex-task-hive-data";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(() => {
    // Load data from localStorage if available
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error("Failed to parse saved data:", error);
        return initialState;
      }
    }
    return initialState;
  });

  // Save to localStorage whenever state changes.
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addList = (name: string) => {
    const newList: TaskList = {
      id: uuidv4(),
      name,
      categories: [...DEFAULT_CATEGORIES], // Initialize with default categories
      createdAt: new Date().toISOString(),
    };

    setState((prev) => {
      const newState = {
        ...prev,
        lists: [...prev.lists, newList],
        activeListId: prev.activeListId || newList.id,
      };
      toast.success({ description: `List "${name}" created.` });
      return newState;
    });
  };

  const updateList = (
    id: string,
    data: Partial<Omit<TaskList, "id" | "createdAt">>
  ) => {
    setState((prev) => ({
      ...prev,
      lists: prev.lists.map((list) =>
        list.id === id ? { ...list, ...data } : list
      ),
    }));
    toast.success({ description: "List updated." });
  };

  const deleteList = (id: string) => {
    setState((prev) => {
      const nextActiveListId =
        prev.lists.length > 1
          ? prev.lists.find((list) => list.id !== id)?.id || null
          : null;

      return {
        ...prev,
        lists: prev.lists.filter((list) => list.id !== id),
        tasks: prev.tasks.filter((task) => task.listId !== id),
        activeListId:
          prev.activeListId === id ? nextActiveListId : prev.activeListId,
      };
    });
    toast.success({ description: `List deleted.` });
  };

  const setActiveList = (id: string) => {
    setState((prev) => ({
      ...prev,
      activeListId: id,
    }));
  };

  const addTask = (description: string, dueDate?: string) => {
    if (!state.activeListId) {
      toast.error({ description: "No active list selected" });
      return;
    }

    const newTask: Task = {
      id: uuidv4(),
      listId: state.activeListId,
      description,
      completedAt: undefined,
      pickedAt: undefined,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));
    toast.success({ description: `Task added` });
  };

  const updateTask = (
    id: string,
    data: Partial<Omit<Task, "id" | "listId" | "createdAt">>
  ) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === id ? { ...task, ...data } : task
      ),
    }));
    toast.success({ description: `Task updated` });
  };

  /**
   * Undo the deletion of the last task, if present.
   * Tasks are taken from the deleted tasks, then inserted into their original position.
   */
  const undoDeleteTask = () => {
    const deletedListTasks = state.deletedTasks.filter(
      (item) => item.listId === state.activeListId
    );
    const [restoreItem] = deletedListTasks.slice(-1);
    if (restoreItem) {
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks
          .slice(0, restoreItem.index)
          .concat(restoreItem.task)
          .concat(prev.tasks.slice(restoreItem.index)),
        deletedTasks: prev.deletedTasks.filter(
          (item) => JSON.stringify(item) !== JSON.stringify(restoreItem)
        ),
      }));
      toast.info({ description: `Task "${restoreItem.task.description}" was restored.` });
    }
  };

  /**
   * Immediately delete a task.
   * Instead of permanently removing it, the task is added to a list of deleted tasks, that can be "undone"
   * with a keypress (or by clicking on the undo button).
   */
  const deleteTask = (id: string) => {
    const removedTask = state.tasks.find((task) => task.id === id);
    if (removedTask) {
      const removedTaskIndex = state.tasks.indexOf(removedTask);
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((task) => task !== removedTask),
        deletedTasks: [
          ...prev.deletedTasks,
          {
            listId: prev.activeListId,
            index: removedTaskIndex,
            task: removedTask,
          },
        ],
      }));
      toast.success({
        description: `Task "${removedTask.description}" removed.`,
        action: (
          <ToastAction
            asChild
            onClick={undoDeleteTask}
            altText={"Undo (Alt+U)"}
          >
            <Button type="button" variant="secondary" size="toast">
              Undo (<kbd>Alt</kbd>+<kbd>U</kbd>)
            </Button>
          </ToastAction>
        ),
      });
    } else {
      toast.error({ description: "Task does not exist!" });
    }
  };

  const toggleTaskCompletion = (id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completedAt: task.completedAt
                ? undefined
                : new Date().toISOString(),
            }
          : task
      ),
    }));
  };

  /**
   * Shuffle the list of tasks.
   * We want to keep any picked and complete tasks in place, so their numbers are preserved.
   */
  const shuffleTasks = () => {
    let allTasks = state.tasks.filter(
      (task) => task.listId === state.activeListId
    );
    let availableTasks = allTasks.filter(
      (task) => !(task.pickedAt || task.completedAt)
    );

    if (availableTasks.length) {
      // Shuffle the available tasks.
      // https://stackoverflow.com/a/12646864/4073160
      const shuffledTasks: Task[] = [];
      for (let i = availableTasks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableTasks[i], availableTasks[j]] = [
          availableTasks[j],
          availableTasks[i],
        ];
      }

      // Rebuild the list of tasks.
      for (let i = 0; i < allTasks.length; i++) {
        if (!(allTasks[i].pickedAt || allTasks[i].completedAt)) {
          shuffledTasks.push(availableTasks.shift());
        } else {
          shuffledTasks.push(allTasks[i]);
        }
      }

      setState((prev) => ({ ...prev, tasks: shuffledTasks }));
      toast.info({ description: "Tasks have been shuffled." });
    } else {
      toast.info({ description: "No tasks to shuffle." });
    }
  };

  const selectRandomTask = () => {
    if (!state.activeListId) return null;

    const listTasks = state.tasks.filter(
      (task) =>
        task.listId === state.activeListId &&
        !(task.pickedAt || task.completedAt)
    );

    if (listTasks.length === 0) {
      toast.info({ description: "No incomplete tasks found in this list." });
      return null;
    }

    const randomIndex = Math.floor(Math.random() * listTasks.length);
    const randomTask = listTasks[randomIndex];

    // Mark the task as picked.
    setState((prev) => ({
      ...prev,
      tasks: state.tasks.map((task) =>
        task.id === randomTask.id
          ? { ...task, pickedAt: new Date().toISOString() }
          : task
      ),
    }));
    toast.success({
      description: `Random task selected: ${randomTask.description}`,
    });
    return randomTask;
  };

  /**
   * Reset the picked and completed state of all tasks for the specified list.
   */
  const resetTasks = (listId: string) => {
    setState((prev) => ({
      ...prev,
      tasks: state.tasks
        .filter((task) => task.listId === listId)
        .map((task) => ({
          ...task,
          pickedAt: undefined,
          completedAt: undefined,
        })),
    }));
    toast.info({ description: "Tasks were reset." });

    toast.info({ description: "Tasks in this list were reset. " });
  };

  /**
   * A function developed by myself to control the "sidebar" (i.e. list of tasks).
   */
  const toggleSidebar = () => {
    setState((prev) => ({
      ...prev,
      sidebarIsOpen: !prev.sidebarIsOpen,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        addList,
        updateList,
        deleteList,
        setActiveList,
        addTask,
        updateTask,
        deleteTask,
        undoDeleteTask,
        toggleTaskCompletion,
        shuffleTasks,
        resetTasks,
        selectRandomTask,
        toggleSidebar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider.");
  }
  return context;
};
