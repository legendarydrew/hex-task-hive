import { FunctionComponent } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useApp } from "@/context/AppContext";

interface ListDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listId: string;
}

export const ListDeleteDialog: FunctionComponent<ListDeleteDialogProps> = ({
  open,
  onOpenChange,
  listId,
}) => {
  const { state, deleteList } = useApp();

  const listToDelete = listId
    ? state.lists.find((list) => list.id === listId)
    : null;

  const confirmHandler = () => {
    if (listToDelete) {
      deleteList(listToDelete.id); // this should also make the next available list active.
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog
      open={open && listToDelete !== null}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {listToDelete?.name}</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to do this?
            <br />
            All the tasks associated with this list will also be removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmHandler}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
