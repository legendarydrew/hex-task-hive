import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ListDialog } from "./ListDialog";

/**
 * Decided to move this section of the header into its own component, because it made sense
 * (keeping code manageable).
 */
export default function TaskListManagement() {
  const { state, setActiveList } = useApp();

  const [isListDialogOpen, setIsListDialogOpen] = useState(false);

  const taskLists = state.lists;

  return (
    <>
      <Select value={state.activeListId} onValueChange={setActiveList}>
        <SelectTrigger className="font-bold h-10 text-sm" id="tasklist">
          <SelectValue placeholder="Task lists" />
        </SelectTrigger>
        <SelectContent>
          {taskLists.map((list) => (
            <SelectItem key={list.id} value={list.id}>
              {list.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        onClick={() => setIsListDialogOpen(true)}
        className="flex items-center gap-1"
      >
        <PlusCircle className="h-4 w-4" />
        <span>New List</span>
      </Button>

      <ListDialog open={isListDialogOpen} onOpenChange={setIsListDialogOpen} />
    </>
  );
}
