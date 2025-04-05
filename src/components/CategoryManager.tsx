
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, Briefcase, Home, Heart, Coins, GraduationCap, CircleDot } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export const CategoryManager = () => {
  const { state, addCategory, removeCategory, getListCategories } = useApp();
  const [newCategory, setNewCategory] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!state.activeListId) return null;
  
  const categories = getListCategories(state.activeListId);
  const activeList = state.lists.find(list => list.id === state.activeListId);
  
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'work':
        return <Briefcase className="h-4 w-4 mr-1" />;
      case 'personal':
        return <Home className="h-4 w-4 mr-1" />;
      case 'health':
        return <Heart className="h-4 w-4 mr-1" />;
      case 'finance':
        return <Coins className="h-4 w-4 mr-1" />;
      case 'education':
        return <GraduationCap className="h-4 w-4 mr-1" />;
      default:
        return <CircleDot className="h-4 w-4 mr-1" />;
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim() && state.activeListId) {
      addCategory(state.activeListId, newCategory.trim());
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (category: string) => {
    if (state.activeListId) {
      removeCategory(state.activeListId, category);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          Manage Categories
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Categories for {activeList?.name}</DialogTitle>
          <DialogDescription>
            Add or remove categories for tasks in this list.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-wrap gap-2 my-4">
          {categories.map((category) => (
            <Badge key={category} className="flex items-center gap-1 pl-2 pr-1 py-1">
              {getCategoryIcon(category)}
              {category}
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 ml-1 p-0"
                onClick={() => handleRemoveCategory(category)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
        
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="category">New Category</Label>
            <div className="flex gap-2">
              <Input
                id="category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
              />
              <Button type="submit" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </form>
        
        <DialogFooter>
          <Button onClick={() => setDialogOpen(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
