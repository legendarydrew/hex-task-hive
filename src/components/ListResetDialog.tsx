import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

interface ListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listId?: string | null;
}

/**
 * This component provides a dialog for confirming the reset (picked and completed status) of tasks in a list.
 */

export const ListResetDialog: React.FC<ListDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { state, resetTasks } = useApp();

  const activeListId = state.activeListId;

  // useEffect can be used to execute code when one or more value changes:
  // the equivalent of Angular's ngOnChanges().
  useEffect(() => {
    // Make sure a list has been selected, or is available.
    if (!activeListId) {
      toast.error("No task list selected.");
      onOpenChange(false);
    }
  }, [activeListId, open]);

  const confirmHandler = () => {
    if (activeListId) {
      resetTasks(activeListId);
    }
    onOpenChange(false);
  };

  const cancelHandler = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Tasks</DialogTitle>
          <DialogDescription>
            This will reset the picked and completed states of each task.
            <br />
            Are you sure you want to do this?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="ghost" onClick={cancelHandler}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirmHandler}>
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
