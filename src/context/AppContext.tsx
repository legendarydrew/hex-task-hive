
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Task, TaskList, Category } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

interface AppContextType {
  state: AppState;
  addList: (name: string) => void;
  updateList: (id: string, name: string) => void;
  deleteList: (id: string) => void;
  setActiveList: (id: string) => void;
  addTask: (description: string, category: Category, dueDate?: string) => void;
  updateTask: (id: string, data: Partial<Omit<Task, 'id' | 'listId' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  selectRandomTask: () => Task | null;
}

const initialState: AppState = {
  lists: [],
  tasks: [],
  activeListId: null,
};

const LOCAL_STORAGE_KEY = 'hex-task-hive-data';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(() => {
    // Load data from localStorage if available
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error('Failed to parse saved data:', error);
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

  const updateList = (id: string, name: string) => {
    setState((prev) => ({
      ...prev,
      lists: prev.lists.map((list) => (list.id === id ? { ...list, name } : list)),
    }));
    toast.success(`List updated`);
  };

  const deleteList = (id: string) => {
    setState((prev) => {
      const nextActiveListId = prev.lists.length > 1 
        ? prev.lists.find(list => list.id !== id)?.id || null 
        : null;
      
      return {
        ...prev,
        lists: prev.lists.filter((list) => list.id !== id),
        tasks: prev.tasks.filter((task) => task.listId !== id),
        activeListId: prev.activeListId === id ? nextActiveListId : prev.activeListId,
      };
    });
    toast.success(`List deleted`);
  };

  const setActiveList = (id: string) => {
    setState((prev) => ({
      ...prev,
      activeListId: id,
    }));
  };

  const addTask = (description: string, category: Category, dueDate?: string) => {
    if (!state.activeListId) {
      toast.error("No active list selected");
      return;
    }

    const newTask: Task = {
      id: uuidv4(),
      listId: state.activeListId,
      description,
      category,
      completed: false,
      dueDate,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));
    toast.success(`Task added`);
  };

  const updateTask = (id: string, data: Partial<Omit<Task, 'id' | 'listId' | 'createdAt'>>) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => (task.id === id ? { ...task, ...data } : task)),
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
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    }));
  };

  const selectRandomTask = () => {
    if (!state.activeListId) return null;
    
    const listTasks = state.tasks.filter(
      (task) => task.listId === state.activeListId && !task.completed
    );
    
    if (listTasks.length === 0) {
      toast.info("No incomplete tasks found in this list");
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * listTasks.length);
    const randomTask = listTasks[randomIndex];
    
    toast.success(`Random task selected: ${randomTask.description}`);
    return randomTask;
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
        selectRandomTask,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
