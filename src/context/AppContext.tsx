import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AppState, Task, TaskList } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface AppContextType {
  state: AppState;
  addList: (name: string) => void;
  updateList: (
    id: string,
    data: Partial<Omit<TaskList, "id" | "createdAt">>
  ) => void;
  deleteList: (id: string) => void;
  setActiveList: (id: string) => void;
  addTask: (description: string, category?: string, dueDate?: string) => void;
  updateTask: (
    id: string,
    data: Partial<Omit<Task, "id" | "listId" | "createdAt">>
  ) => void;
  deleteTask: (id: string) => void;
  shuffleTasks: () => void;
  resetTasks: (listId: string) => void;
  toggleTaskCompletion: (id: string) => void;
  selectRandomTask: () => Task | null;
  addCategory: (listId: string, category: string) => void;
  removeCategory: (listId: string, category: string) => void;
  getListCategories: (listId: string) => string[];
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
  activeListId: null,
};

const LOCAL_STORAGE_KEY = "hex-task-hive-data";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(() => {
    // Load data from localStorage if available
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);

        // Handle migration for existing lists without categories
        if (parsedData.lists && parsedData.lists.length > 0) {
          parsedData.lists = parsedData.lists.map((list: any) => ({
            ...list,
            categories: list.categories || [...DEFAULT_CATEGORIES],
          }));
        }

        return parsedData;
      } catch (error) {
        console.error("Failed to parse saved data:", error);
        return initialState;
      }
    }
    return initialState;
  });

  // Save to localStorage whenever state changes
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
      toast.success(`List "${name}" created`);
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
    toast.success(`List updated`);
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
    toast.success(`List deleted.`);
  };

  const setActiveList = (id: string) => {
    setState((prev) => ({
      ...prev,
      activeListId: id,
    }));
  };

  const addTask = (description: string, category: string, dueDate?: string) => {
    if (!state.activeListId) {
      toast.error("No active list selected");
      return;
    }

    const newTask: Task = {
      id: uuidv4(),
      listId: state.activeListId,
      description,
      category,
      completedAt: undefined,
      pickedAt: undefined,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));
    toast.success(`Task added`);
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
    toast.success(`Task updated`);
  };

  const deleteTask = (id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== id),
    }));
    toast.success(`Task deleted`);
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
    let allTasks = state.tasks.filter((task) => task.listId === state.activeListId);
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
      toast.info("Tasks have been shuffled.");
    } else {
      toast.info("No tasks to shuffle.");
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
      toast.info("No incomplete tasks found in this list.");
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
    toast.success(`Random task selected: ${randomTask.description}`);
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
    toast.info("Tasks were reset.");
  };

  // New functions for managing categories
  const addCategory = (listId: string, category: string) => {
    setState((prev) => ({
      ...prev,
      lists: prev.lists.map((list) => {
        if (list.id === listId && !list.categories.includes(category)) {
          return {
            ...list,
            categories: [...list.categories, category],
          };
        }
        return list;
      }),
    }));
    toast.success(`Category "${category}" added`);
  };

  const removeCategory = (listId: string, category: string) => {
    // First check if any tasks are using this category
    const tasksUsingCategory = state.tasks.some(
      (task) => task.listId === listId && task.category === category
    );

    if (tasksUsingCategory) {
      toast.error(
        `Cannot remove category "${category}" because tasks are using it`
      );
      return;
    }

    setState((prev) => ({
      ...prev,
      lists: prev.lists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            categories: list.categories.filter((cat) => cat !== category),
          };
        }
        return list;
      }),
    }));
    toast.success(`Category "${category}" removed`);
  };

  const getListCategories = (listId: string) => {
    const list = state.lists.find((list) => list.id === listId);
    return list ? list.categories : [];
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
        toggleTaskCompletion,
        shuffleTasks,
        resetTasks,
        selectRandomTask,
        addCategory,
        removeCategory,
        getListCategories,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
