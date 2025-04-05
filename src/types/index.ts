
export type Category = 'work' | 'personal' | 'health' | 'finance' | 'education' | 'other';

export interface Task {
  id: string;
  listId: string;
  description: string;
  category: string; // Changed from Category type to string to support custom categories
  completed: boolean;
  dueDate?: string; // ISO date string
  createdAt: string; // ISO date string
}

export interface TaskList {
  id: string;
  name: string;
  categories: string[]; // Array of category names for this list
  createdAt: string; // ISO date string
}

export interface AppState {
  lists: TaskList[];
  tasks: Task[];
  activeListId: string | null;
}
