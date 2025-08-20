export type Category =
  | "work"
  | "personal"
  | "health"
  | "finance"
  | "education"
  | "other";

export interface Task {
  id: string;
  listId: string;
  description: string;
  category: string; // Changed from Category type to string to support custom categories
  createdAt: string; // ISO date string
  pickedAt?: string; // ISO date string
  completedAt?: string; // ISO date string
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
  deletedTasks: DeletedTaskItem[];
  activeListId: string | null;
  sidebarIsOpen: boolean;
}

export interface DeletedTaskItem {
  listId: string;
  index: number;
  task: Task
}