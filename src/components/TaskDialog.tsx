
import React from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useApp } from '@/context/AppContext';
import { Category } from '@/types';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string | null;
}

export const TaskDialog: React.FC<TaskDialogProps> = ({ 
  open, 
  onOpenChange,
  taskId 
}) => {
  const { state, addTask, updateTask, deleteTask, toggleTaskCompletion } = useApp();
  const isEditing = taskId !== null;
  
  const existingTask = taskId 
    ? state.tasks.find(task => task.id === taskId) 
    : null;
  
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState<Category>('work');
  const [dueDate, setDueDate] = React.useState('');
  const [completed, setCompleted] = React.useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);

  // Reset form when dialog opens/closes or task changes
  React.useEffect(() => {
    if (existingTask) {
      setDescription(existingTask.description);
      setCategory(existingTask.category);
      setDueDate(existingTask.dueDate || '');
      setCompleted(existingTask.completed);
    } else {
      setDescription('');
      setCategory('work');
      setDueDate('');
      setCompleted(false);
    }
  }, [existingTask, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && existingTask) {
      updateTask(existingTask.id, {
        description,
        category,
        dueDate: dueDate || undefined,
        completed,
      });
    } else {
      addTask(description, category, dueDate || undefined);
    }
    
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (isEditing && existingTask) {
      deleteTask(existingTask.id);
      setShowDeleteAlert(false);
      onOpenChange(false);
    }
  };

  const handleToggleCompletion = () => {
    setCompleted(!completed);
    if (isEditing && existingTask) {
      toggleTaskCompletion(existingTask.id);
    }
  };

  const categoryColors = {
    work: 'bg-hexagon-blue',
    personal: 'bg-hexagon-purple',
    health: 'bg-hexagon-green',
    finance: 'bg-hexagon-yellow',
    education: 'bg-hexagon-orange',
    other: 'bg-gray-400',
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Make changes to your task here.' 
                : 'Fill out the details for your new task.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Checkbox 
                  id="completed" 
                  checked={completed} 
                  onCheckedChange={() => handleToggleCompletion()}
                />
                <Label htmlFor="completed" className="text-sm font-medium">
                  Mark as completed
                </Label>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What needs to be done?"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={category} 
                  onValueChange={(value) => setCategory(value as Category)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${categoryColors.work}`} />
                        Work
                      </div>
                    </SelectItem>
                    <SelectItem value="personal">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${categoryColors.personal}`} />
                        Personal
                      </div>
                    </SelectItem>
                    <SelectItem value="health">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${categoryColors.health}`} />
                        Health
                      </div>
                    </SelectItem>
                    <SelectItem value="finance">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${categoryColors.finance}`} />
                        Finance
                      </div>
                    </SelectItem>
                    <SelectItem value="education">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${categoryColors.education}`} />
                        Education
                      </div>
                    </SelectItem>
                    <SelectItem value="other">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${categoryColors.other}`} />
                        Other
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date (Optional)</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              {isEditing && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowDeleteAlert(true)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </Button>
              )}
              <Button type="submit">
                {isEditing ? 'Save Changes' : 'Create Task'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
