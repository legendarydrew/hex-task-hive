
import React from 'react';
import { Button } from "@/components/ui/button";
import { useApp } from '@/context/AppContext';
import { PlusCircle, Shuffle, StickyNote } from 'lucide-react';
import { TaskDialog } from './TaskDialog';
import { ListDialog } from './ListDialog';

export const Header = () => {
  const { state, selectRandomTask, shuffleTasks } = useApp();
  const [isListDialogOpen, setIsListDialogOpen] = React.useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<string | null>(null);
  
  const handleRandomTask = () => {
    const task = selectRandomTask();
    if (task) {
      setSelectedTask(task.id);
    }
  };

  return (
    <header className="w-full bg-white shadow-sm py-4 px-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">Hex Task Hive</h1>
        </div>
        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
          <Button 
            variant="outline" 
            onClick={() => setIsListDialogOpen(true)}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New List</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setIsTaskDialogOpen(true)}
            className="flex items-center gap-1"
            disabled={!state.activeListId}
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Task</span>
          </Button>
          
          <Button
            variant="secondary"
            onClick={shuffleTasks}
            disabled={!state.activeListId}
            className="flex items-center gap-1"
          >
            <Shuffle className="h-4 w-4" />
            <span>Shuffle Tasks</span>
          </Button>
          
          <Button
            variant="default"
            onClick={handleRandomTask}
            disabled={!state.activeListId}
            className="flex items-center gap-1"
          >
            <StickyNote className="h-4 w-4" />
            <span>Random Task</span>
          </Button>
        </div>
      </div>
      
      <TaskDialog 
        open={isTaskDialogOpen || selectedTask !== null} 
        onOpenChange={(open) => {
          setIsTaskDialogOpen(open);
          if (!open) setSelectedTask(null);
        }} 
        taskId={selectedTask}
      />
      
      <ListDialog 
        open={isListDialogOpen} 
        onOpenChange={setIsListDialogOpen} 
      />
    </header>
  );
};
