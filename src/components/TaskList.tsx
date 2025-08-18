import { useApp } from "@/context/AppContext";
import { Task } from "@/types";
import TaskListUpdateForm from "./TaskListUpdateForm";
import { useState } from "react";
import { TaskListItem } from "./TaskListItem";
import { cn } from '@/lib/utils.ts';

/**
 * A component simply displaying the list of tasks in the currently selected list.
 * From here we should be able to update or remove the tasks.
 */

export default function TaskList(props) {
    const { state } = useApp();

    const [taskForEdit, setTaskForEdit] = useState<Task>();

    const activeTasks: Task[] = state.activeListId
        ? state.tasks.filter((task) => task.listId === state.activeListId)
        : [];

    const editHandler = (task: Task): void => {
        setTaskForEdit(task);
    };

    const closeUpdateHandler = (): void => {
        setTaskForEdit(undefined);
    };

    const taskClass = (task: Task) => {
        if (task.completedAt) {
            return "bg-task-complete/40 hover:bg-task-complete/60";
        } else if (task.pickedAt) {
            return "bg-task-picked/25 hover:bg-task-picked/50";
        } else {
            return "bg-task-base/25 hover:bg-task-base/50";
        }
    };

    return (
        <ol className="w-full p-1 text-sm">
            {activeTasks.map((task: Task, index) => (
                <li
                    className={cn("flex gap-2 p-0.5 items-center select-none", taskClass(task))}
                    key={task.id}
                >
                    {taskForEdit === task ? (
                        <TaskListUpdateForm task={task} onClose={closeUpdateHandler}/>
                    ) : (
                        <TaskListItem task={task} taskNumber={index} onEdit={editHandler}/>
                    )}
                </li>
            ))}
        </ol>
    );
}
