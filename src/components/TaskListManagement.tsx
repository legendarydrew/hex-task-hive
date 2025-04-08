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
import { List, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { ListDialog } from "./ListDialog";
import { ListDeleteDialog } from "./ListDeleteDialog";

/**
 * Decided to move this section of the header into its own component, because it made sense
 * (keeping code manageable).
 */
export default function TaskListManagement() {
  const { state, setActiveList } = useApp();

  const [isListDialogOpen, setIsListDialogOpen] = useState(false);
  const [isListDeleteDialogOpen, setIsListDeleteDialogOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState<string | null>(null);

  const taskLists = state.lists;

  const deleteListHandler = () => {
    setListToDelete(state.activeListId);
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
              {/* <DropdownMenuItem onClick={() => setListToEdit(state.activeListId)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={deleteListHandler}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={() => setIsListDialogOpen(true)}>
            <List className="h-4 w-4 mr-2" />
            New List
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ListDialog open={isListDialogOpen} onOpenChange={setIsListDialogOpen} />
      <ListDeleteDialog
        listId={listToDelete}
        open={isListDeleteDialogOpen}
        onOpenChange={setIsListDeleteDialogOpen}
      />
    </>
  );
}
