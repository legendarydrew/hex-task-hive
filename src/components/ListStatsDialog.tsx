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
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Statistics for {activeList?.name}</DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          <table className="table table.fixed w-full">
            <thead className="text-xs">
              <tr className="border-b-2">
                <th className="text-left" scope="col">Task</th>
                <th className="w-[10em]" scope="col">picked on</th>
                <th className="w-[10em]" scope="col">completed at</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {activeListTasks.map((task) => (
                <tr className="hover:bg-gray-200">
                  <th className="text-left font-bold" scope="row">
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
