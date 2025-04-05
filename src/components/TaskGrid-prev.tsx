
import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Check, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { TaskDialog } from './TaskDialog';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from 'framer-motion';

const TaskGrid = () => {
  const { state, toggleTaskCompletion } = useApp();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Filter tasks for the active list
  const activeTasks = state.activeListId
    ? state.tasks.filter((task) => task.listId === state.activeListId)
    : [];

  // Get active list
  const activeList = state.activeListId 
    ? state.lists.find(list => list.id === state.activeListId)
    : null;

  // Get category color class
  const getCategoryColorClass = (category: string) => {
    const normalizedCategory = category.toLowerCase();
    
    switch (normalizedCategory) {
      case 'work':
        return 'bg-hexagon-blue';
      case 'personal':
        return 'bg-hexagon-purple';
      case 'health':
        return 'bg-hexagon-green';
      case 'finance':
        return 'bg-hexagon-yellow';
      case 'education':
        return 'bg-hexagon-orange';
      default:
        // Generate a deterministic color based on category name
        const hash = normalizedCategory.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const colors = ['bg-sky-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600', 'bg-violet-600', 'bg-teal-600'];
        return colors[hash % colors.length];
    }
  };

  const handleHighlight = (id: string | null) => {
    setHighlightedId(id);
    
    // Clear highlight after animation
    if (id) {
      setTimeout(() => {
        setHighlightedId(null);
      }, 2000);
    }
  };

  useEffect(() => {
    // Find the task that was selected randomly
    const randomlySelectedTask = activeTasks.find(task => task.id === highlightedId);
    if (randomlySelectedTask) {
      // Scroll to the task element
      const taskElement = document.getElementById(`task-${randomlySelectedTask.id}`);
      if (taskElement) {
        taskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedId, activeTasks]);

  return (
    <div className="flex-1 p-6 overflow-auto">
      {!state.activeListId ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h2 className="text-2xl font-bold text-muted-foreground mb-2">Welcome to Hex Task Hive</h2>
          <p className="text-muted-foreground max-w-md">
            Select a list from the sidebar or create a new list to get started.
          </p>
        </div>
      ) : activeTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h2 className="text-xl font-bold text-muted-foreground mb-2">No tasks in this list</h2>
          <p className="text-muted-foreground max-w-md">
            Create your first task by clicking the "New Task" button above.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h2 className="text-2xl font-bold">
              {activeList?.name || 'Tasks'}
            </h2>
          </div>
          
          <div className="hexagon-grid">
            {activeTasks.map((task, index) => {
              const isHighlighted = task.id === highlightedId;
              const categoryColor = getCategoryColorClass(task.category);
              
              return (
                <motion.div
                  key={task.id}
                  id={`task-${task.id}`}
                  animate={isHighlighted ? {
                    scale: [1, 1.05, 1],
                    transition: { repeat: 3, duration: 0.7 }
                  } : {}}
                  className={`hexagon relative ${categoryColor} ${task.completed ? 'opacity-60' : ''} cursor-pointer p-4 h-[150px] flex flex-col items-center justify-center text-white shadow-md`}
                  onClick={() => setSelectedTaskId(task.id)}
                >
                  <div className="absolute top-2 left-0 right-0 flex justify-center">
                    <Badge variant="outline" className="bg-white/20 text-white text-xs px-2 py-0.5">
                      {String(index + 1).padStart(2, '0')}
                    </Badge>
                  </div>
                  
                  <div className="text-center mt-4">
                    <p className="font-medium text-sm line-clamp-3">{task.description}</p>
                  </div>
                  
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-2">
                    {task.dueDate && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-white/80 flex items-center text-xs">
                              <Calendar className="h-3 w-3 mr-1" />
                              {format(new Date(task.dueDate), 'MMM d')}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Due: {format(new Date(task.dueDate), 'MMMM d, yyyy')}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className={`h-5 w-5 rounded-full border border-white/60 flex items-center justify-center ${task.completed ? 'bg-white/30' : 'bg-transparent'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTaskCompletion(task.id);
                            }}
                          >
                            {task.completed && <Check className="h-3 w-3 text-white" />}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{task.completed ? 'Mark as incomplete' : 'Mark as complete'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <div className="absolute bottom-2 right-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="bg-white/20 text-white text-xs">
                            {task.category}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Category: {task.category}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
      
      <TaskDialog 
        open={selectedTaskId !== null} 
        onOpenChange={(open) => !open && setSelectedTaskId(null)}
        taskId={selectedTaskId}
      />
    </div>
  );
};

export default TaskGrid;
