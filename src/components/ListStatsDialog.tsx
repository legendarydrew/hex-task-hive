import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApp } from "@/context/AppContext";
import { toast } from "./ui/use-toast";
import { ListStatsChart } from "./ListStatsChart";

/**
 * This component is for a dialog that displays a list of Tasks in a list, with their picked and completed dates.
 */
interface ListStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listId?: string | null;
}

export const ListStatsDialog: React.FC<ListStatsDialogProps> = ({
  open,
  onOpenChange,
  listId,
}) => {
  const { state } = useApp();

  const activeList = state.lists.find((list) => list.id === listId);
  const activeListTasks = state.tasks.filter((task) => task.listId === listId);

  const formatDate = (timestamp: string): string => {
    return new Date(timestamp).toLocaleDateString("en-GB");
  };

  useEffect(() => {
    if (open && !activeListTasks.length) {
      onOpenChange(false);
      toast.info({ description: "No tasks in this list." });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Statistics for {activeList?.name}</DialogTitle>
        </DialogHeader>

        <ListStatsChart taskList={activeList} />

        <div className="max-h-[45vh] overflow-y-auto">
          <table className="table w-full">
            <thead>
              <tr className="text-xs sticky top-0 bg-background border-b-2">
                <th className="text-right heading-text px-1 w-4" scope="col">
                  #
                </th>
                <th className="text-left px-1" scope="col">
                  Task
                </th>
                <th className="w-[10em]" scope="col">
                  picked on
                </th>
                <th className="w-[10em]" scope="col">
                  completed at
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {activeListTasks.map((task, index) => (
                <tr className="hover:bg-gray-200" key={index}>
                  <th className="text-right heading-text px-1 w-4" scope="row">
                    {index + 1}
                  </th>
                  <th className="text-left font-normal px-1" scope="row">
                    {task.description}
                  </th>
                  <td className="text-center text-xs">
                    {task.pickedAt ? formatDate(task.pickedAt) : "-"}
                  </td>
                  <td className="text-center text-xs">
                    {task.completedAt ? formatDate(task.completedAt) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};
