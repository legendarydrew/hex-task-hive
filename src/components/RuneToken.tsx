import React from "react";
import { Task } from "@/types";
import { useApp } from "@/context/AppContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { cn } from "@/lib/utils.ts";

interface Props {
  className?: string;
  taskNumber: number | string;
  task: Task;
  x?: number;
  y?: number;
}

/**
 * A component representing a task as a "rune token".
 * The colour of the token (background or text?) will be determined by the task list's palette.
 */

export const RuneToken: React.FC<Props> = ({
  className,
  task,
  taskNumber,
  x,
  y,
}) => {
  const { toggleTaskCompletion } = useApp();

  const wasPicked = (): boolean => {
    return !!task.pickedAt;
  };

  const isComplete = (): boolean => {
    return !!task.completedAt;
  };

  const runeClasses = (): string => {
    // I prefer the array method, but was told (read: beaten over the head with an AI-generated solution)
    // that this string method was "better". Do you agree?
    return cn(
      "rune-token",
      className,
      wasPicked() && "picked",
      isComplete() && "complete"
    );
  };

  const clickHandler = (): void => {
    toggleTaskCompletion(task.id);
  };

  return (
    <Tooltip>
      <TooltipTrigger
        type="button"
        className={runeClasses()}
        style={{ left: `${x}px`, top: `${y}px` }}
        onClick={clickHandler}
      >
        <span className="font-display text-2xl font-bold text-center z-10">
          {taskNumber}
        </span>
      </TooltipTrigger>
      <TooltipContent sideOffset={1} className="font-bold">
        {taskNumber}: {task.description}
      </TooltipContent>
    </Tooltip>
  );
};
