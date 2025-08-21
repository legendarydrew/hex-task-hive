import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Edit,
  List,
  ListCheckIcon,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { ListDialog } from "./ListDialog";
import { ListDeleteDialog } from "./ListDeleteDialog";
import { ListStatsDialog } from "./ListStatsDialog";

/**
 * Decided to move this section of the header into its own component, because it made sense
 * (keeping code manageable).
 */
export default function TaskListManagement() {
  const { state, setActiveList } = useApp();

  const [isListDialogOpen, setIsListDialogOpen] = useState(false);
  const [isListDeleteDialogOpen, setIsListDeleteDialogOpen] = useState(false);
  const [isListStatsDialogOpen, setIsListStatsDialogOpen] = useState(false);
  const [listIdToUse, setListIdToUse] = useState<string | null>(null);

  const taskLists = state.lists;
  const hasTasks = state.tasks.find(
    (task) => task.listId === state.activeListId
  );

  /**
   * Open the dialog for creating a new task list.
   */
  const newListHandler = () => {
    setListIdToUse('');
    setIsListDialogOpen(true);
  };

  /**
   * Open the dialog for renaming an existing task list.
   */
  const renameListHandler = () => {
    setListIdToUse(state.activeListId);
    setIsListDialogOpen(true);
  };

  /**
   * Open the dialog for displaying task list stats.
   */
  const listStatsHandler = () => {
    if (hasTasks) {
      setListIdToUse(state.activeListId);
      setIsListStatsDialogOpen(true);
    }
  };

  /**
   * Open the dialog for confirming the deletion of a task list.
   */
  const deleteListHandler = () => {
    setListIdToUse(state.activeListId);
    setIsListDeleteDialogOpen(true);
  };

  return (
    <>
      <Select value={state.activeListId} onValueChange={setActiveList}>
        <SelectTrigger className="font-bold h-10 text-sm" id="tasklist">
          <SelectValue placeholder="No task lists" />
        </SelectTrigger>
        <SelectContent>
          {taskLists.map((list) => (
            <SelectItem key={list.id} value={list.id}>
              {list.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-9">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {state.activeListId && (
            <>
              <DropdownMenuItem onClick={renameListHandler}>
                <Edit className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={listStatsHandler} disabled={!hasTasks}>
                <ListCheckIcon className="h-4 w-4 mr-2" />
                Display Stats
              </DropdownMenuItem>
              <DropdownMenuItem onClick={deleteListHandler}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={newListHandler}>
            <List className="h-4 w-4 mr-2" />
            New List
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialogs. */}
      <ListDialog open={isListDialogOpen} listId={listIdToUse} onOpenChange={setIsListDialogOpen} />
      <ListStatsDialog
        listId={listIdToUse}
        open={isListStatsDialogOpen}
        onOpenChange={setIsListStatsDialogOpen}
      />
      <ListDeleteDialog
        listId={listIdToUse}
        open={isListDeleteDialogOpen}
        onOpenChange={setIsListDeleteDialogOpen}
      />
    </>
  );
}
