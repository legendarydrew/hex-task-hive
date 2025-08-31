export interface Task {
  id: string;
  listId: string;
  description: string;
  createdAt: string; // ISO date string
  pickedAt?: string; // ISO date string
  completedAt?: string; // ISO date string
}

export interface TaskList {
  id: string;
  name: string;
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
  task: Task;
}
