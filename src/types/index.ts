
export type Category = 'work' | 'personal' | 'health' | 'finance' | 'education' | 'other';

export interface Task {
  id: string;
  listId: string;
  description: string;
  category: Category;
  completed: boolean;
  dueDate?: string; // ISO date string
  createdAt: string; // ISO date string
}

export interface TaskList {
  id: string;
  name: string;
  createdAt: string; // ISO date string
}

export interface AppState {
  lists: TaskList[];
  tasks: Task[];
  activeListId: string | null;
}
