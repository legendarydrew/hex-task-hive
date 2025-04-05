
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useApp } from '@/context/AppContext';
import { CategoryManager } from './CategoryManager';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string | null;
}

export const TaskDialog: React.FC<TaskDialogProps> = ({ open, onOpenChange, taskId }) => {
  const { state, addTask, updateTask, deleteTask, getListCategories } = useApp();
  const isEditing = taskId !== null;
  
  const existingTask = isEditing 
    ? state.tasks.find(task => task.id === taskId) 
    : null;
  
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Get categories for the active list
  const categories = state.activeListId ? getListCategories(state.activeListId) : [];

  // Reset form when dialog opens/closes or task changes
  useEffect(() => {
    if (existingTask) {
      setDescription(existingTask.description);
      setCategory(existingTask.category);
      setDueDate(existingTask.dueDate ? new Date(existingTask.dueDate) : undefined);
    } else {
      setDescription('');
      setCategory(categories.length > 0 ? categories[0] : '');
      setDueDate(undefined);
    }
  }, [existingTask, open, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && existingTask) {
      updateTask(existingTask.id, {
        description,
        category,
        dueDate: dueDate ? dueDate.toISOString() : undefined,
      });
    } else {
      addTask(
        description,
        category,
        dueDate ? dueDate.toISOString() : undefined
      );
    }
    
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (isEditing && existingTask) {
      deleteTask(existingTask.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>{isEditing ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            {state.activeListId && <CategoryManager />}
          </div>
          <DialogDescription>
            {isEditing 
              ? 'Update your task details below.' 
              : 'Fill in the details for your new task.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              onValueChange={setCategory}
              required
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dueDate">Due Date (Optional)</Label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal"
                  id="dueDate"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => {
                    setDueDate(date);
                    setDatePickerOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {dueDate && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => setDueDate(undefined)}
              >
                Clear Date
              </Button>
            )}
          </div>
          
          <DialogFooter className="flex justify-between">
            {isEditing && (
              <Button type="button" variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            )}
            <Button type="submit">
              {isEditing ? 'Update Task' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
