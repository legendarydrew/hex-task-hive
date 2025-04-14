import React from "react";
import { Task } from "@/types";
import { useApp } from "@/context/AppContext";
import "./RuneToken.scss";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface RuneTokenProps {
  taskNumber: number | string;
  task: Task;
}

/**
 * A component representing a task as a "rune token".
 * The colour of the token (background or text?) will be determined by the task list's palette.
 */

export const RuneToken: React.FC<RuneTokenProps> = ({ task, taskNumber }) => {
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
    return `rune-token${wasPicked() ? " picked" : ""}${
      isComplete() ? " complete" : ""
    }`;
  };

  const clickHandler = (): void => {
    toggleTaskCompletion(task.id);
  };

  return (
    <Tooltip>
      <TooltipTrigger
        type="button"
        className={runeClasses()}
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
