import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApp } from "@/context/AppContext";

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
    return new Date(timestamp).toLocaleDateString('en-GB');
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Statistics for {activeList?.name}</DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          <table className="table w-full">
            <thead>
              <tr className="text-xs sticky top-0 bg-background border-b-2">
                <th className="text-right px-1 w-4" scope="col">#</th>
                <th className="text-left px-1" scope="col">Task</th>
                <th className="w-[10em]" scope="col">picked on</th>
                <th className="w-[10em]" scope="col">completed at</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {activeListTasks.map((task, index) => (
                <tr className="hover:bg-gray-200" key={index}>
                  <th className="text-right font-bold px-1 w-4" scope="row">
                    {index}
                  </th>
                  <th className="text-left font-bold px-1" scope="row">
                    {task.description}
                  </th>
                  <td className="text-center">{task.pickedAt ? formatDate(task.pickedAt) : "-"}</td>
                  <td className="text-center">{task.completedAt ? formatDate(task.completedAt) : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};
