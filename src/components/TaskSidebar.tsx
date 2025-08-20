import { useApp } from "@/context/AppContext";
import TaskFormToggle from "./TaskFormToggle";
import TaskList from "./TaskList";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";

export const TaskSidebar = () => {
  const { state, toggleSidebar } = useApp();

  return (
    state.activeListId && (
      <div
        className={cn(
          "relative h-full transition-[left,margin-left] duration-400 sm:w-1/3",
          state.sidebarIsOpen ? "left-0 ml-0" : "left-1/3 ml-[-33%]"
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild
            className="absolute right-[100%]"
            onClick={toggleSidebar}
          >
            <Button variant="ghost" className="py-2 px-3 rounded-r-none">
            {state.sidebarIsOpen ? <ChevronRight /> : <ChevronLeft />}
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={1}>
            Toggle task list
          </TooltipContent>
        </Tooltip>
        <aside className="bg-white h-full ease-linear flex-shrink-0 flex flex-col overflow-x-hidden">
          <div className="flex-grow overflow-y-auto h-full">
            <TaskList />
          </div>
          <TaskFormToggle />
        </aside>
      </div>
    )
  );
};
